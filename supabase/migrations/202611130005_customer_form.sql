-- Un unico guardado transaccional para contacto y direccion.
begin;
create function public.save_commercial_customer_form(
 p_id uuid,p_version integer,p_address_version integer,p_data jsonb
) returns uuid
language plpgsql security definer set search_path='' as $$
declare
 result_id uuid;
 address_row public.commercial_addresses;
 address_text text;
 address_notes text;
begin
 if not private.has_access('customers.manage') then raise exception 'Forbidden' using errcode='42501'; end if;
 if p_data is null or jsonb_typeof(p_data)<>'object'
    or p_data - array['name','phone','address_text','notes']::text[] <> '{}'::jsonb
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
 return result_id;
end;
$$;
revoke all on function public.save_commercial_customer_form(uuid,integer,integer,jsonb) from public,anon;
grant execute on function public.save_commercial_customer_form(uuid,integer,integer,jsonb) to authenticated;
notify pgrst, 'reload schema';
commit;
