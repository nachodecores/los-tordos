-- Cuenta corriente de stock por repartidor; sin centros ni aprovisionamiento.
begin;
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
        when 'logistics.manage' then p.roles && array['admin','logistica']::text[]
        when 'deliveries.operate' then p.roles && array['admin','reparto']::text[]
        when 'collections.manage' then p.roles && array['admin','cobranzas']::text[]
        when 'wholesale.own' then p.roles && array['admin','mayorista']::text[]
        else false
      end
  );
$$;
create table public.commercial_stock_accounts (
 courier_id uuid not null references public.staff_profiles(id) on delete restrict,
 product_id uuid not null references public.commercial_products(id) on delete restrict,
 balance integer not null default 0 check(balance>=0),
 version integer not null default 1 check(version>0),
 updated_at timestamptz not null default now(),
 primary key(courier_id,product_id)
);
create table public.commercial_stock_movements (
 id uuid primary key default gen_random_uuid(),
 request_key uuid not null unique,
 request_hash text not null,
 courier_id uuid not null,
 product_id uuid not null,
 kind text not null check(kind in ('entry','correction')),
 quantity integer not null check(quantity>=0),
 delta integer not null check(delta<>0),
 balance_before integer not null check(balance_before>=0),
 balance_after integer not null check(balance_after>=0),
 reason text check(reason is null or length(trim(reason)) between 1 and 1000),
 actor_id uuid not null references public.staff_profiles(id) on delete restrict,
 occurred_at timestamptz not null default now(),
 foreign key(courier_id,product_id) references public.commercial_stock_accounts(courier_id,product_id) on delete restrict,
 check(balance_after::bigint=balance_before::bigint+delta::bigint),
 check((kind='entry' and quantity>0 and delta=quantity) or (kind='correction' and balance_after=quantity and reason is not null))
);
create index commercial_stock_movements_courier_idx on public.commercial_stock_movements(courier_id,occurred_at desc,id);
alter table public.commercial_stock_accounts enable row level security;
alter table public.commercial_stock_movements enable row level security;
revoke all on public.commercial_stock_accounts,public.commercial_stock_movements from public,anon,authenticated;
grant select on public.commercial_stock_accounts,public.commercial_stock_movements to authenticated;
create policy stock_accounts_read on public.commercial_stock_accounts for select to authenticated
 using((select private.has_access('stock.manage')) or (courier_id=(select auth.uid()) and (select private.has_access('stock.read'))));
create policy stock_movements_read on public.commercial_stock_movements for select to authenticated
 using((select private.has_access('stock.manage')) or (courier_id=(select auth.uid()) and (select private.has_access('stock.read'))));

create function public.record_commercial_stock(
 p_key uuid,p_courier_id uuid,p_product_id uuid,p_kind text,p_quantity integer,p_version integer,p_reason text
) returns uuid
language plpgsql security definer set search_path='' as $$
declare previous public.commercial_stock_movements; account public.commercial_stock_accounts;
 result_id uuid; request_hash text; difference bigint; next_balance bigint; note text;
begin
 if not private.has_access('stock.manage') then raise exception 'Forbidden' using errcode='42501'; end if;
 note:=nullif(trim(p_reason),'');
 if p_key is null or p_courier_id is null or p_product_id is null or p_kind is null or p_kind not in ('entry','correction')
   or p_quantity is null or p_quantity<0 or (p_kind='entry' and p_quantity=0)
   or (p_kind='correction' and note is null) or length(note)>1000 then
   raise exception 'Invalid movement' using errcode='22023';
 end if;
 request_hash:=encode(sha256(convert_to(jsonb_build_object('courier',p_courier_id,'product',p_product_id,
   'kind',p_kind,'quantity',p_quantity,'version',p_version,'reason',note)::text,'UTF8')),'hex');
 perform pg_advisory_xact_lock(hashtextextended('stock-request:'||p_key::text,0));
 select * into previous from public.commercial_stock_movements where request_key=p_key;
 if found then
   if previous.actor_id<>auth.uid() or previous.request_hash<>request_hash then raise exception 'Request key already used' using errcode='22023'; end if;
   return previous.id;
 end if;
 -- Serializa tambien la primera entrada, antes de existir una fila de cuenta.
 perform pg_advisory_xact_lock(hashtextextended('stock-account:'||p_courier_id::text||':'||p_product_id::text,0));
 select * into account from public.commercial_stock_accounts where courier_id=p_courier_id and product_id=p_product_id for update;
 if found then
   if p_version is null or p_version<>account.version then raise exception 'Record changed' using errcode='40001'; end if;
 else
   if p_version is not null then raise exception 'Record changed' using errcode='40001'; end if;
 end if;
 -- Entradas para repartidores activos. Se pueden corregir cuentas historicas existentes.
 if (p_kind='entry' or account.courier_id is null) and not exists(
   select 1 from public.staff_profiles where id=p_courier_id and active and roles @> array['reparto']::text[]
 ) then raise exception 'Active courier required' using errcode='22023'; end if;
 perform 1 from public.commercial_products where id=p_product_id for share;
 if not found then raise exception 'Product not found' using errcode='P0002'; end if;
 difference:=case when p_kind='entry' then p_quantity else p_quantity::bigint-coalesce(account.balance,0) end;
 next_balance:=coalesce(account.balance,0)::bigint+difference;
 if difference=0 then raise exception 'Balance unchanged' using errcode='22023'; end if;
 if next_balance<0 or next_balance>2147483647 then raise exception 'Invalid balance' using errcode='22003'; end if;
 if account.courier_id is null then
   insert into public.commercial_stock_accounts(courier_id,product_id,balance) values(p_courier_id,p_product_id,next_balance::integer);
 else
   update public.commercial_stock_accounts set balance=next_balance::integer,version=version+1,updated_at=now()
    where courier_id=p_courier_id and product_id=p_product_id;
 end if;
 insert into public.commercial_stock_movements(request_key,request_hash,courier_id,product_id,kind,quantity,
   delta,balance_before,balance_after,reason,actor_id)
 values(p_key,request_hash,p_courier_id,p_product_id,p_kind,p_quantity,difference::integer,
   coalesce(account.balance,0),next_balance::integer,note,auth.uid()) returning id into result_id;
 return result_id;
end;
$$;

-- Solo datos de stock: no se amplian permisos de lectura sobre precios, clientes o usuarios.
create function public.commercial_stock_balances()
returns table(courier_id uuid,courier_name text,courier_active boolean,product_id uuid,product_name text,sku text,balance integer,version integer)
language plpgsql stable security definer set search_path='' as $$
begin
 if not private.has_access('stock.read') then raise exception 'Forbidden' using errcode='42501'; end if;
 return query select a.courier_id,p.name,p.active,a.product_id,c.name,c.sku,a.balance,a.version
 from public.commercial_stock_accounts a join public.staff_profiles p on p.id=a.courier_id
 join public.commercial_products c on c.id=a.product_id
 where private.has_access('stock.manage') or a.courier_id=auth.uid()
 order by p.name,c.name;
end;
$$;
create function public.commercial_stock_history(p_courier_id uuid default null,p_page integer default 1)
returns table(id uuid,courier_name text,product_name text,kind text,delta integer,balance_before integer,
 balance_after integer,reason text,actor_name text,occurred_at timestamptz,total_count bigint)
language plpgsql stable security definer set search_path='' as $$
begin
 if not private.has_access('stock.read') then raise exception 'Forbidden' using errcode='42501'; end if;
 if p_page is null or p_page<1 or p_page>100000 then raise exception 'Invalid page' using errcode='22023'; end if;
 if p_courier_id is not null and p_courier_id<>auth.uid() and not private.has_access('stock.manage') then
   raise exception 'Forbidden' using errcode='42501';
 end if;
 return query select m.id,p.name,c.name,m.kind,m.delta,m.balance_before,m.balance_after,m.reason,actor.name,m.occurred_at,
 count(*) over()
 from public.commercial_stock_movements m join public.staff_profiles p on p.id=m.courier_id
 join public.commercial_products c on c.id=m.product_id join public.staff_profiles actor on actor.id=m.actor_id
 where (private.has_access('stock.manage') or m.courier_id=auth.uid()) and (p_courier_id is null or m.courier_id=p_courier_id)
 order by m.occurred_at desc,m.id desc limit 25 offset ((p_page-1)*25);
end;
$$;
revoke all on function public.record_commercial_stock(uuid,uuid,uuid,text,integer,integer,text),
 public.commercial_stock_balances(),public.commercial_stock_history(uuid,integer) from public,anon;
grant execute on function public.record_commercial_stock(uuid,uuid,uuid,text,integer,integer,text),
 public.commercial_stock_balances(),public.commercial_stock_history(uuid,integer) to authenticated;
notify pgrst, 'reload schema';
commit;
