-- Roles vigentes: Administracion, Reparto y Cobranzas. No elimina usuarios.
begin;
select pg_advisory_xact_lock(74673001);
lock table public.staff_invitations,public.staff_profiles in access exclusive mode;
do $$
begin
 if exists(select 1 from public.staff_profiles where not (roles && array['admin','reparto','cobranzas']::text[]))
    or exists(select 1 from public.staff_invitations where not (roles && array['admin','reparto','cobranzas']::text[])) then
   raise exception 'Hay usuarios o invitaciones sin un rol vigente. Revisar su asignacion antes de retirar roles; no se modifico ningun registro.';
 end if;
end;
$$;
-- Guarda la asignacion anterior, sin otorgar roles nuevos automaticamente.
insert into public.access_audit(target_id,action,details)
 select id,'roles.retired',jsonb_build_object('previous_roles',roles,
   'roles',array_remove(array_remove(roles,'logistica'),'mayorista'))
 from public.staff_profiles where roles && array['logistica','mayorista']::text[];
insert into public.access_audit(action,details)
 select 'invitation.roles_retired',jsonb_build_object('invitation_id',id,'previous_roles',roles,
   'roles',array_remove(array_remove(roles,'logistica'),'mayorista'))
 from public.staff_invitations where roles && array['logistica','mayorista']::text[];
update public.staff_profiles set roles=array_remove(array_remove(roles,'logistica'),'mayorista'),updated_at=now()
 where roles && array['logistica','mayorista']::text[];
update public.staff_invitations set roles=array_remove(array_remove(roles,'logistica'),'mayorista')
 where roles && array['logistica','mayorista']::text[];
alter table public.staff_profiles drop constraint staff_profiles_roles_check;
alter table public.staff_invitations drop constraint staff_invitations_roles_check;
alter table public.staff_profiles add constraint staff_profiles_roles_check
 check(cardinality(roles)>0 and array_position(roles,null) is null and roles <@ array['admin','reparto','cobranzas']::text[]);
alter table public.staff_invitations add constraint staff_invitations_roles_check
 check(cardinality(roles)>0 and array_position(roles,null) is null and roles <@ array['admin','reparto','cobranzas']::text[]);
create or replace function private.has_access(permission text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.staff_profiles p
    where p.id=auth.uid() and p.active and not p.onboarding_required
      and exists(select 1 from auth.sessions s where s.id::text=auth.jwt()->>'session_id' and s.user_id=p.id)
      and case permission
        when 'stock.manage' then p.roles @> array['admin']::text[]
        when 'stock.read' then p.roles && array['admin','reparto']::text[]
        when 'staff.access' then true
        when 'users.manage' then p.roles @> array['admin']::text[]
        when 'catalog.manage' then p.roles @> array['admin']::text[]
        when 'customers.manage' then p.roles @> array['admin']::text[]
        when 'deliveries.manage' then p.roles @> array['admin']::text[]
        when 'deliveries.operate' then p.roles && array['admin','reparto']::text[]
        when 'collections.manage' then p.roles && array['admin','cobranzas']::text[]
        else false
      end
  );
$$;
create or replace function public.reserve_staff_invitation(p_email text,p_name text,p_roles text[]) returns uuid
language plpgsql security definer set search_path = '' as $$
declare invitation_id uuid;
begin
  if not private.has_access('users.manage') then raise exception 'Forbidden' using errcode = '42501'; end if;
  if p_email is null or p_name is null or p_roles is null or array_position(p_roles,null) is not null or p_email <> lower(trim(p_email)) or length(p_email)>254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or length(trim(p_name)) not between 1 and 100 or cardinality(p_roles) < 1
    or not (p_roles <@ array['admin','reparto','cobranzas']::text[]) then
    raise exception 'Invalid invitation' using errcode = '22023';
  end if;
  insert into public.staff_invitations(email,name,roles,invited_by)
    values(p_email,trim(p_name),p_roles,auth.uid()) returning id into invitation_id;
  insert into public.access_audit(actor_id,action,details)
    values(auth.uid(),'invitation.created',jsonb_build_object('invitation_id',invitation_id,'roles',p_roles));
  return invitation_id;
end;
$$;

create or replace function public.update_staff_access(p_id uuid,p_name text,p_roles text[],p_active boolean) returns void
language plpgsql security definer set search_path = '' as $$
declare previous public.staff_profiles;
begin
  -- Serializa cambios de permisos, incluso desactivaciones simultáneas de administradores.
  perform pg_advisory_xact_lock(74673001);
  if not private.has_access('users.manage') then raise exception 'Forbidden' using errcode = '42501'; end if;
  if p_active is null or array_position(p_roles,null) is not null or p_roles is null or cardinality(p_roles)<1
     or not (p_roles <@ array['admin','reparto','cobranzas']::text[])
     or p_name is null or length(trim(p_name)) not between 1 and 100 then
    raise exception 'Invalid access' using errcode = '22023';
  end if;
  select * into previous from public.staff_profiles where id = p_id for update;
  if previous.id is null then raise exception 'User not found'; end if;
  if previous.active and previous.roles @> array['admin']::text[]
     and (not p_active or not (p_roles @> array['admin']::text[]))
     and not exists(select 1 from public.staff_profiles where id<>p_id and active and not onboarding_required and roles @> array['admin']::text[]) then
    raise exception 'Cannot remove last administrator' using errcode = '23514';
  end if;
  update public.staff_profiles set name=trim(p_name),roles=p_roles,active=p_active,updated_at=now() where id=p_id;
  insert into public.access_audit(actor_id,target_id,action,details)
    values(auth.uid(),p_id,'access.updated',jsonb_build_object(
      'previous',jsonb_build_object('name',previous.name,'roles',previous.roles,'active',previous.active),
      'next',jsonb_build_object('name',trim(p_name),'roles',p_roles,'active',p_active)));
end;
$$;

notify pgrst, 'reload schema';
commit;
