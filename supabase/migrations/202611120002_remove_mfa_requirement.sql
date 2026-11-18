-- Decisión del usuario: acceso por invitación y contraseña, sin segundo factor.
-- Conserva la validación de sesión, perfil activo, alta completada y permisos por rol.
begin;
create or replace function private.has_access(permission text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.staff_profiles p
    where p.id = auth.uid() and p.active and not p.onboarding_required
      and exists (
        select 1 from auth.sessions s
        where s.id::text = auth.jwt()->>'session_id' and s.user_id = p.id
      )
      and case permission
        when 'staff.access' then true
        when 'users.manage' then p.roles @> array['admin']::text[]
        when 'logistics.manage' then p.roles && array['admin','logistica']::text[]
        when 'deliveries.operate' then p.roles && array['admin','reparto']::text[]
        when 'collections.manage' then p.roles && array['admin','cobranzas']::text[]
        when 'wholesale.own' then p.roles && array['admin','mayorista']::text[]
        else false
      end
  );
$$;
revoke all on function private.has_access(text) from public;
grant execute on function private.has_access(text) to authenticated;
commit;
