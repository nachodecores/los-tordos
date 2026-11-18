-- Ubicaciones manuales y una zona comercial general, sin zona precargada.
begin;
create function private.geo_cross(a jsonb,b jsonb,c jsonb) returns numeric
language sql immutable set search_path='' as $$
 select ((b->>0)::numeric-(a->>0)::numeric)*((c->>1)::numeric-(a->>1)::numeric)
       -((b->>1)::numeric-(a->>1)::numeric)*((c->>0)::numeric-(a->>0)::numeric);
$$;
create function private.geo_on_segment(a jsonb,b jsonb,p jsonb) returns boolean
language sql immutable set search_path='' as $$
 select abs(private.geo_cross(a,b,p))<0.000000001
   and (p->>0)::numeric between least((a->>0)::numeric,(b->>0)::numeric)-0.000000001 and greatest((a->>0)::numeric,(b->>0)::numeric)+0.000000001
   and (p->>1)::numeric between least((a->>1)::numeric,(b->>1)::numeric)-0.000000001 and greatest((a->>1)::numeric,(b->>1)::numeric)+0.000000001;
$$;
create function private.valid_coverage_boundary(points jsonb) returns boolean
language plpgsql immutable set search_path='' as $$
declare n integer; i integer; j integer; a jsonb; b jsonb; c jsonb; d jsonb;
 area numeric:=0; min_x numeric:=180; max_x numeric:=-180; min_y numeric:=85; max_y numeric:=-85;
begin
 if points is null or jsonb_typeof(points)<>'array' then return false; end if;
 n:=jsonb_array_length(points);
 if n<3 or n>100 then return false; end if;
 for i in 0..n-1 loop
   a:=points->i;
   if jsonb_typeof(a)<>'array' or jsonb_array_length(a)<>2 then return false; end if;
   if jsonb_typeof(a->0)<>'number' or jsonb_typeof(a->1)<>'number' then return false; end if;
   if (a->>0)::numeric not between -180 and 180 or (a->>1)::numeric not between -85 and 85
     or (a->>0)::numeric<>round((a->>0)::numeric,6) or (a->>1)::numeric<>round((a->>1)::numeric,6) then return false; end if;
   min_x:=least(min_x,(a->>0)::numeric); max_x:=greatest(max_x,(a->>0)::numeric);
   min_y:=least(min_y,(a->>1)::numeric); max_y:=greatest(max_y,(a->>1)::numeric);
 end loop;
 if max_x-min_x>5 or max_y-min_y>5 then return false; end if;
 for i in 0..n-1 loop
   a:=points->i; b:=points->((i+1)%n);
   if abs(private.geo_cross(points->((i+n-1)%n),a,b))<0.000000000001 then return false; end if;
   area:=area+(a->>0)::numeric*(b->>1)::numeric-(b->>0)::numeric*(a->>1)::numeric;
   for j in i+1..n-1 loop
     c:=points->j; d:=points->((j+1)%n);
     if a=c then return false; end if;
     if j=(i+1)%n or (i=0 and j=n-1) then continue; end if;
     if (private.geo_cross(a,b,c)*private.geo_cross(a,b,d)<0 and private.geo_cross(c,d,a)*private.geo_cross(c,d,b)<0)
       or private.geo_on_segment(a,b,c) or private.geo_on_segment(a,b,d)
       or private.geo_on_segment(c,d,a) or private.geo_on_segment(c,d,b) then return false; end if;
   end loop;
 end loop;
 return abs(area)>=0.0000000001;
exception when others then return false;
end;
$$;

create table public.commercial_coverage (
 singleton boolean primary key default true check(singleton),
 boundary jsonb not null check(private.valid_coverage_boundary(boundary)),
 active boolean not null default false,
 version integer not null default 1 check(version>0),
 updated_by uuid not null references public.staff_profiles(id) on delete restrict,
 updated_at timestamptz not null default now()
);
alter table public.commercial_coverage enable row level security;
revoke all on public.commercial_coverage from public,anon,authenticated;
grant select on public.commercial_coverage to authenticated;
create policy coverage_admin_read on public.commercial_coverage for select to authenticated
 using ((select private.has_access('customers.manage')));

create function public.save_commercial_coverage(p_version integer,p_boundary jsonb,p_active boolean) returns void
language plpgsql security definer set search_path='' as $$
declare previous public.commercial_coverage;
begin
 if not private.has_access('customers.manage') then raise exception 'Forbidden' using errcode='42501'; end if;
 if p_active is null or not private.valid_coverage_boundary(p_boundary) then raise exception 'Invalid boundary' using errcode='22023'; end if;
 perform pg_advisory_xact_lock(74673002);
 select * into previous from public.commercial_coverage where singleton for update;
 if found then
   if p_version is null or p_version<>previous.version then raise exception 'Record changed' using errcode='40001'; end if;
   update public.commercial_coverage set boundary=p_boundary,active=p_active,version=version+1,updated_by=auth.uid(),updated_at=now() where singleton;
 else
   if p_version is not null then raise exception 'Record changed' using errcode='40001'; end if;
   insert into public.commercial_coverage(boundary,active,updated_by) values(p_boundary,p_active,auth.uid());
 end if;
 insert into public.access_audit(actor_id,action,details) values(auth.uid(),'coverage.updated',
   jsonb_build_object('previous',to_jsonb(previous),'boundary',p_boundary,'active',p_active));
end;
$$;

create function public.commercial_point_coverage(p_latitude numeric,p_longitude numeric) returns text
language plpgsql stable security definer set search_path='' as $$
declare zone public.commercial_coverage; i integer; n integer; a jsonb; b jsonb; p jsonb;
 inside boolean:=false;
begin
 if not private.has_access('customers.manage') then raise exception 'Forbidden' using errcode='42501'; end if;
 if p_latitude is null or p_longitude is null then return 'unchecked'; end if;
 if p_latitude not between -85 and 85 or p_longitude not between -180 and 180 then raise exception 'Invalid coordinates' using errcode='22023'; end if;
 select * into zone from public.commercial_coverage where singleton and active;
 if not found then return 'unchecked'; end if;
 p:=jsonb_build_array(p_longitude,p_latitude); n:=jsonb_array_length(zone.boundary);
 for i in 0..n-1 loop
   a:=zone.boundary->i; b:=zone.boundary->((i+1)%n);
   if private.geo_on_segment(a,b,p) then return 'ambiguous'; end if;
   if ((a->>1)::numeric>p_latitude)<>((b->>1)::numeric>p_latitude) then
     if p_longitude < ((b->>0)::numeric-(a->>0)::numeric)*(p_latitude-(a->>1)::numeric)/((b->>1)::numeric-(a->>1)::numeric)+(a->>0)::numeric then inside:=not inside; end if;
   end if;
 end loop;
 return case when inside then 'covered' else 'outside' end;
end;
$$;
create or replace function public.save_commercial_customer_form(
 p_id uuid,p_version integer,p_address_version integer,p_data jsonb
) returns uuid
language plpgsql security definer set search_path='' as $$
declare
 result_id uuid;
 address_row public.commercial_addresses;
 address_text text;
 address_notes text;
 lat numeric; lon numeric;
begin
 if not private.has_access('customers.manage') then raise exception 'Forbidden' using errcode='42501'; end if;
 if p_data is null or jsonb_typeof(p_data)<>'object'
    or p_data - array['name','phone','address_text','notes','latitude','longitude']::text[] <> '{}'::jsonb
    or jsonb_typeof(p_data->'name') is distinct from 'string'
    or jsonb_typeof(p_data->'phone') is distinct from 'string'
    or length(trim(p_data->>'name')) not between 1 and 160
    or length(p_data->>'phone') > 16
    or (p_data ? 'address_text' and jsonb_typeof(p_data->'address_text') not in ('string','null'))
    or (p_data ? 'notes' and jsonb_typeof(p_data->'notes') not in ('string','null')) then
   raise exception 'Invalid customer fields' using errcode='22023';
 end if;
 address_text:=nullif(trim(p_data->>'address_text'),'');
 address_notes:=nullif(trim(p_data->>'notes'),'');
 if length(address_text)>500 or length(address_notes)>1000
    or (address_text is null and address_notes is not null) then
   raise exception 'Invalid address' using errcode='22023';
 end if;
 if (p_data ? 'latitude') <> (p_data ? 'longitude') then raise exception 'Coordinate pair required' using errcode='22023'; end if;
 if p_data ? 'latitude' then
   if jsonb_typeof(p_data->'latitude') not in ('number','null') or jsonb_typeof(p_data->'longitude') not in ('number','null') then
     raise exception 'Invalid coordinates' using errcode='22023';
   end if;
   lat:=(p_data->>'latitude')::numeric; lon:=(p_data->>'longitude')::numeric;
   if (lat is null)<>(lon is null) or lat not between -85 and 85 or lon not between -180 and 180
     or (lat is not null and address_text is null) then raise exception 'Invalid coordinates' using errcode='22023'; end if;
   lat:=round(lat,6); lon:=round(lon,6);
 end if;
 -- La funcion existente bloquea el cliente y verifica la version antes de actualizar.
 result_id:=public.save_commercial_customer(p_id,p_version,jsonb_build_object('name',p_data->>'name','phone',p_data->>'phone'));
 select * into address_row from public.commercial_addresses where customer_id=result_id for update;
 if found then
   if p_address_version is null or p_address_version<>address_row.version then
     raise exception 'Record changed' using errcode='40001';
   end if;
   if address_text is null then raise exception 'Address required' using errcode='22023'; end if;
   -- Editar solo contacto u observaciones no invalida una ubicacion verificada.
   if address_row.address_text is distinct from address_text then
     perform public.save_commercial_address(address_row.id,result_id,p_address_version,
       jsonb_build_object('address_text',address_text,'notes',address_notes));
   elsif address_row.notes is distinct from address_notes then
     update public.commercial_addresses set notes=address_notes,version=version+1,
       updated_by=auth.uid(),updated_at=now() where id=address_row.id;
   end if;
 else
   if p_address_version is not null then raise exception 'Record changed' using errcode='40001'; end if;
   if address_text is not null then
     perform public.save_commercial_address(null,result_id,null,
       jsonb_build_object('address_text',address_text,'notes',address_notes));
   end if;
 end if;
 if p_data ? 'latitude' then
   update public.commercial_addresses set latitude=lat,longitude=lon,
     location_verified_at=case when lat is null then null else now() end,
     updated_by=auth.uid(),updated_at=now(),
     version=case when version=address_row.version then version+1 else version end
   where customer_id=result_id and (latitude is distinct from lat or longitude is distinct from lon
     or (lat is not null and location_verified_at is null));
 end if;
 return result_id;
end;
$$;
revoke all on function private.geo_cross(jsonb,jsonb,jsonb),private.geo_on_segment(jsonb,jsonb,jsonb),
 private.valid_coverage_boundary(jsonb) from public,anon,authenticated;
revoke all on function public.save_commercial_coverage(integer,jsonb,boolean),
 public.commercial_point_coverage(numeric,numeric) from public,anon;
grant execute on function public.save_commercial_coverage(integer,jsonb,boolean),
 public.commercial_point_coverage(numeric,numeric) to authenticated;
notify pgrst, 'reload schema';
commit;
