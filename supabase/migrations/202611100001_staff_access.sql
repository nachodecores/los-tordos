-- Preparada para el proyecto comercial; NO ejecutar contra tablas del tambo sin revisar.
-- No elimina tablas, registros ni usuarios existentes.
begin;
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table public.staff_profiles (
  id uuid primary key references auth.users(id) on delete restrict,
  email text not null unique,
  name text not null check (length(trim(name)) between 1 and 100),
  roles text[] not null check (cardinality(roles) > 0 and roles <@ array['admin','logistica','reparto','cobranzas','mayorista']::text[]),
  active boolean not null default true,
  onboarding_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.staff_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(trim(email))),
  name text not null check (length(trim(name)) between 1 and 100),
  roles text[] not null check (cardinality(roles) > 0 and roles <@ array['admin','logistica','reparto','cobranzas','mayorista']::text[]),
  invited_by uuid,
  auth_user_id uuid references auth.users(id) on delete restrict,
  delivery_status text not null default 'pending' check (delivery_status in ('pending','sent','error')),
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
create table public.access_audit (
  id bigint generated always as identity primary key,
  actor_id uuid,
  target_id uuid,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create function private.has_access(permission text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.staff_profiles p
    where p.id = auth.uid() and p.active and not p.onboarding_required
      and exists (select 1 from auth.sessions s where s.id::text = auth.jwt()->>'session_id' and s.user_id = p.id)
      and (
        (not (p.roles && array['admin','cobranzas']::text[])
          and not exists (select 1 from auth.mfa_factors f where f.user_id = p.id and f.status = 'verified'))
        or auth.jwt()->>'aal' = 'aal2'
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

alter table public.staff_profiles enable row level security;
alter table public.staff_invitations enable row level security;
alter table public.access_audit enable row level security;
revoke all on public.staff_profiles, public.staff_invitations, public.access_audit from anon, authenticated;
grant select on public.staff_profiles, public.staff_invitations, public.access_audit to authenticated;
create policy profiles_read on public.staff_profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.has_access('users.manage')));
create policy invitations_read on public.staff_invitations for select to authenticated
  using ((select private.has_access('users.manage')));
create policy audit_read on public.access_audit for select to authenticated
  using ((select private.has_access('users.manage')));

-- Consume una invitación aprobada. Nunca toma permisos de user_metadata.
create function private.handle_invited_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare invitation public.staff_invitations;
begin
  select * into invitation from public.staff_invitations
    where email = lower(new.email) and auth_user_id is null for update;
  if invitation.id is null then
    raise exception 'Invitation required';
  end if;
  insert into public.staff_profiles(id,email,name,roles)
    values(new.id,lower(new.email),invitation.name,invitation.roles);
  update public.staff_invitations set auth_user_id = new.id where id = invitation.id;
  insert into public.access_audit(actor_id,target_id,action,details)
    values(invitation.invited_by,new.id,'invitation.linked',jsonb_build_object('invitation_id',invitation.id));
  return new;
end;
$$;
revoke all on function private.handle_invited_user() from public;
create trigger on_staff_invited after insert on auth.users
  for each row execute function private.handle_invited_user();

create function public.reserve_staff_invitation(p_email text,p_name text,p_roles text[]) returns uuid
language plpgsql security definer set search_path = '' as $$
declare invitation_id uuid;
begin
  if not private.has_access('users.manage') then raise exception 'Forbidden' using errcode = '42501'; end if;
  if p_email <> lower(trim(p_email)) or length(p_email)>254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or length(trim(p_name)) not between 1 and 100 or cardinality(p_roles) < 1
    or not (p_roles <@ array['admin','logistica','reparto','cobranzas','mayorista']::text[]) then
    raise exception 'Invalid invitation' using errcode = '22023';
  end if;
  insert into public.staff_invitations(email,name,roles,invited_by)
    values(p_email,trim(p_name),p_roles,auth.uid()) returning id into invitation_id;
  insert into public.access_audit(actor_id,action,details)
    values(auth.uid(),'invitation.created',jsonb_build_object('invitation_id',invitation_id,'roles',p_roles));
  return invitation_id;
end;
$$;

create function public.record_invitation_delivery(p_id uuid,p_success boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not private.has_access('users.manage') then raise exception 'Forbidden' using errcode = '42501'; end if;
  update public.staff_invitations set delivery_status = case when p_success then 'sent' else 'error' end,
    sent_at = case when p_success then now() else sent_at end where id = p_id;
  if not found then raise exception 'Invitation not found'; end if;
  insert into public.access_audit(actor_id,action,details)
    values(auth.uid(),case when p_success then 'invitation.sent' else 'invitation.delivery_failed' end,jsonb_build_object('invitation_id',p_id));
end;
$$;

create function public.update_staff_access(p_id uuid,p_name text,p_roles text[],p_active boolean) returns void
language plpgsql security definer set search_path = '' as $$
declare previous public.staff_profiles;
begin
  -- Serializa cambios de permisos, incluso desactivaciones simultáneas de administradores.
  perform pg_advisory_xact_lock(74673001);
  if not private.has_access('users.manage') then raise exception 'Forbidden' using errcode = '42501'; end if;
  if p_active is null or p_roles is null or cardinality(p_roles)<1
     or not (p_roles <@ array['admin','logistica','reparto','cobranzas','mayorista']::text[])
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

create function public.complete_staff_onboarding() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or not exists(select 1 from auth.sessions where user_id=auth.uid() and id::text=auth.jwt()->>'session_id')
    or not exists(select 1 from auth.users where id=auth.uid() and email_confirmed_at is not null and encrypted_password is not null and encrypted_password <> '') then
    raise exception 'Verified account and password required' using errcode='42501';
  end if;
  update public.staff_profiles set onboarding_required=false,updated_at=now()
    where id=auth.uid() and active and onboarding_required;
  if found then insert into public.access_audit(actor_id,target_id,action) values(auth.uid(),auth.uid(),'onboarding.completed'); end if;
end;
$$;

revoke all on function public.reserve_staff_invitation(text,text,text[]),
 public.record_invitation_delivery(uuid,boolean), public.update_staff_access(uuid,text,text[],boolean),
 public.complete_staff_onboarding() from public, anon;
grant execute on function public.reserve_staff_invitation(text,text,text[]),
 public.record_invitation_delivery(uuid,boolean), public.update_staff_access(uuid,text,text[],boolean),
 public.complete_staff_onboarding() to authenticated;
create function public.staff_session_is_valid() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from auth.sessions s join public.staff_profiles p on p.id=s.user_id
    where p.id=auth.uid() and p.active and s.id::text=auth.jwt()->>'session_id');
$$;
revoke all on function public.staff_session_is_valid() from public,anon;
grant execute on function public.staff_session_is_valid() to authenticated;
commit;
