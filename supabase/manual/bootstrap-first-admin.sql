-- NO EJECUTADO. Preparar SOLO la primera invitación desde SQL Editor.
-- Antes: migración staff_access aplicada y registro público deshabilitado.
-- Después: Auth > Users > Invite user con el mismo correo.
do $$
declare
  admin_email text := 'CAMBIAR_CORREO';
  admin_name text := 'CAMBIAR_NOMBRE';
begin
  if admin_email='CAMBIAR_CORREO' or admin_name='CAMBIAR_NOMBRE'
     or admin_email<>lower(trim(admin_email)) or position('@' in admin_email)=0 then
    raise exception 'Completar nombre y correo real normalizado antes de ejecutar';
  end if;
  if exists(select 1 from public.staff_profiles where active and roles @> array['admin']::text[]) then
    raise exception 'Ya existe un administrador. Usar el panel de usuarios';
  end if;
  if exists(select 1 from auth.users where lower(email)=admin_email) then
    raise exception 'El correo ya existe en Auth: revisar esa cuenta antes de asociarla; no se modifica automáticamente';
  end if;
  insert into public.staff_invitations(email,name,roles)
    values(admin_email,admin_name,array['admin']::text[]);
  insert into public.access_audit(action,details)
    values('bootstrap.invitation_reserved',jsonb_build_object('email',admin_email));
end;
$$;
