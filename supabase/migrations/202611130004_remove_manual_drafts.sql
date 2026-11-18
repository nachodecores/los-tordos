-- Retira la operativa de borradores manuales. Conserva datos y migraciones aplicadas.
begin;
drop function public.save_manual_order_draft(uuid,uuid,integer,jsonb);
create or replace function private.has_access(permission text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.staff_profiles p
    where p.id=auth.uid() and p.active and not p.onboarding_required
      and exists(select 1 from auth.sessions s where s.id::text=auth.jwt()->>'session_id' and s.user_id=p.id)
      and case permission
        when 'staff.access' then true
        when 'users.manage' then p.roles @> array['admin']::text[]
        when 'catalog.manage' then p.roles @> array['admin']::text[]
        when 'customers.manage' then p.roles @> array['admin']::text[]
        when 'logistics.manage' then p.roles && array['admin','logistica']::text[]
        when 'deliveries.operate' then p.roles && array['admin','reparto']::text[]
        when 'collections.manage' then p.roles && array['admin','cobranzas']::text[]
        when 'wholesale.own' then p.roles && array['admin','mayorista']::text[]
        else false
      end
  );
$$;
revoke all on public.commercial_orders,public.commercial_order_items,public.commercial_order_events,
 public.commercial_order_summaries,public.commercial_order_item_details from anon,authenticated;
notify pgrst, 'reload schema';
commit;
