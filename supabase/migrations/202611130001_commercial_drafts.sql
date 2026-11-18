-- Modulo comercial: catalogo, clientes, direcciones y borradores manuales.
-- Sin confirmacion, reservas, entregas, pagos ni parametros comerciales precargados.
begin;

create table public.commercial_products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null check (length(trim(name)) > 0),
  nominal_weight_grams integer check (nominal_weight_grams > 0),
  unit_price numeric(12,2) check (unit_price > 0),
  currency text check (currency ~ '^[A-Z]{3}$'),
  active boolean not null default false,
  updated_by uuid references public.staff_profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not active or (nominal_weight_grams is not null and unit_price is not null and currency is not null))
);

create table public.commercial_customers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  phone text not null unique check (phone ~ '^\+[1-9][0-9]{7,14}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.commercial_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.commercial_customers(id) on delete restrict,
  address_text text not null check (length(trim(address_text)) > 0),
  latitude numeric(9,6) check (latitude between -90 and 90),
  longitude numeric(9,6) check (longitude between -180 and 180),
  location_verified_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(customer_id,id),
  check ((latitude is null) = (longitude is null)),
  check (location_verified_at is null or latitude is not null)
);

create table public.commercial_orders (
  id uuid primary key default gen_random_uuid(),
  number bigint generated always as identity unique,
  idempotency_key text not null unique,
  source text not null check (source in ('manual','whatsapp')),
  source_event_id text unique,
  manual_reason text,
  created_by uuid references public.staff_profiles(id) on delete restrict,
  customer_id uuid references public.commercial_customers(id) on delete restrict,
  address_id uuid,
  status text not null default 'draft' check (status in ('draft','confirmed','cancelled')),
  delivery_status text check (delivery_status in ('available','reserved','out_for_delivery','delivered','failed')),
  payment_status text not null default 'not_due' check (payment_status in ('not_due','pending','paid')),

  -- Copia de lo acordado. Cambiar la ficha del cliente no modifica un pedido confirmado.
  recipient_name text,
  recipient_phone text check (recipient_phone ~ '^\+[1-9][0-9]{7,14}$'),
  delivery_address_text text,
  latitude numeric(9,6) check (latitude between -90 and 90),
  longitude numeric(9,6) check (longitude between -180 and 180),
  currency text check (currency ~ '^[A-Z]{3}$'),
  coverage_status text not null default 'unchecked' check (coverage_status in ('unchecked','covered','outside','ambiguous')),
  coverage_checked_at timestamptz,

  assigned_to uuid references public.staff_profiles(id) on delete restrict,
  confirmed_at timestamptz,
  reserved_at timestamptz,
  delivered_at timestamptz,
  payment_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  foreign key(customer_id,address_id) references public.commercial_addresses(customer_id,id) on delete restrict,
  check (address_id is null or customer_id is not null),
  check ((latitude is null) = (longitude is null)),
  check (source <> 'manual' or (created_by is not null and manual_reason is not null and length(trim(manual_reason)) > 0)),
  check (source <> 'whatsapp' or source_event_id is not null),
  check (status <> 'draft' or (delivery_status is null and confirmed_at is null)),
  check (status <> 'confirmed' or (
    customer_id is not null and address_id is not null
    and recipient_name is not null and length(trim(recipient_name)) > 0
    and recipient_phone is not null
    and delivery_address_text is not null and length(trim(delivery_address_text)) > 0
    and latitude is not null and currency is not null
    and coverage_status = 'covered' and coverage_checked_at is not null
    and confirmed_at is not null and delivery_status is not null
  )),
  check (payment_status <> 'paid' or payment_confirmed_at is not null),
  check (delivery_status <> 'delivered' or delivered_at is not null)
);

create table public.commercial_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.commercial_orders(id) on delete restrict,
  product_id uuid not null references public.commercial_products(id) on delete restrict,
  product_name text not null check (length(trim(product_name)) > 0),
  nominal_weight_grams integer check (nominal_weight_grams > 0),
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) check (unit_price > 0),
  line_total numeric(18,2) generated always as (quantity * unit_price) stored,
  unique(order_id,product_id)
);

create table public.commercial_order_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.commercial_orders(id) on delete restrict,
  event_type text not null,
  actor_type text not null check (actor_type in ('staff','whatsapp','system')),
  actor_id uuid references public.staff_profiles(id) on delete restrict,
  external_event_id text unique,
  occurred_at timestamptz not null default now(),
  details jsonb not null default '{}'::jsonb,
  check (actor_type <> 'staff' or actor_id is not null)
);

create table public.commercial_settings (
  singleton boolean primary key default true check (singleton),
  unreserved_timeout_seconds integer check (unreserved_timeout_seconds > 0),
  reserved_timeout_seconds integer check (reserved_timeout_seconds > 0),
  unpaid_timeout_seconds integer check (unpaid_timeout_seconds > 0),
  updated_by uuid references public.staff_profiles(id) on delete restrict,
  updated_at timestamptz not null default now()
);

create index commercial_addresses_customer_idx on public.commercial_addresses(customer_id);
create index commercial_orders_customer_idx on public.commercial_orders(customer_id);
create index commercial_orders_delivery_idx on public.commercial_orders(delivery_status,confirmed_at);
create index commercial_orders_assigned_idx on public.commercial_orders(assigned_to,delivery_status);
create index commercial_orders_payment_idx on public.commercial_orders(payment_status,delivered_at);
create index commercial_order_events_order_idx on public.commercial_order_events(order_id,occurred_at,id);

-- Escrituras solo mediante las RPC transaccionales definidas a continuacion.
alter table public.commercial_products enable row level security;
alter table public.commercial_customers enable row level security;
alter table public.commercial_addresses enable row level security;
alter table public.commercial_orders enable row level security;
alter table public.commercial_order_items enable row level security;
alter table public.commercial_order_events enable row level security;
alter table public.commercial_settings enable row level security;
revoke all on public.commercial_products, public.commercial_customers, public.commercial_addresses,
 public.commercial_orders, public.commercial_order_items, public.commercial_order_events,
 public.commercial_settings from public, anon, authenticated;


-- Permisos comerciales dedicados; no se utiliza users.manage para operar pedidos.
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
        when 'orders.read' then p.roles @> array['admin']::text[]
        when 'orders.create_manual' then p.roles @> array['admin']::text[]
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
grant usage on schema public to authenticated;

alter table public.commercial_products add column version integer not null default 1 check(version>0);
alter table public.commercial_customers add column version integer not null default 1 check(version>0),
  add column updated_by uuid references public.staff_profiles(id) on delete restrict;
alter table public.commercial_addresses add column version integer not null default 1 check(version>0),
  add column updated_by uuid references public.staff_profiles(id) on delete restrict;
alter table public.commercial_orders add column version integer not null default 1 check(version>0),
  add column creation_request_hash text;

grant select on public.commercial_products, public.commercial_customers, public.commercial_addresses,
 public.commercial_orders, public.commercial_order_items, public.commercial_order_events to authenticated;
create policy products_admin_read on public.commercial_products for select to authenticated using ((select private.has_access('catalog.manage')));
create policy customers_admin_read on public.commercial_customers for select to authenticated using ((select private.has_access('customers.manage')));
create policy addresses_admin_read on public.commercial_addresses for select to authenticated using ((select private.has_access('customers.manage')));
create policy orders_admin_read on public.commercial_orders for select to authenticated using ((select private.has_access('orders.read')));
create policy items_admin_read on public.commercial_order_items for select to authenticated using ((select private.has_access('orders.read')));
create policy events_admin_read on public.commercial_order_events for select to authenticated using ((select private.has_access('orders.read')));

-- La vista respeta las pol?ticas de las tablas y devuelve los importes como texto decimal exacto.
create view public.commercial_order_summaries with (security_invoker=true) as
select o.id,o.number,o.status,o.source,o.customer_id,o.recipient_name,o.created_at,o.updated_at,o.version,o.currency,
 count(i.id)::integer as item_count,
 coalesce(sum(i.quantity),0)::bigint as package_count,
 case when count(i.id)>0 and count(i.unit_price)=count(i.id) and o.currency is not null
   then sum(i.line_total)::text else null end as total_text
from public.commercial_orders o left join public.commercial_order_items i on i.order_id=o.id
group by o.id;
revoke all on public.commercial_order_summaries from public,anon,authenticated;
grant select on public.commercial_order_summaries to authenticated;


create view public.commercial_order_item_details with (security_invoker=true) as
select id,order_id,product_id,product_name,nominal_weight_grams,quantity,
 unit_price::text as unit_price,line_total::text as line_total
from public.commercial_order_items;
revoke all on public.commercial_order_item_details from public,anon,authenticated;
grant select on public.commercial_order_item_details to authenticated;

create function public.save_commercial_product(p_id uuid,p_version integer,p_data jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare result_id uuid; current_version integer;
begin
  if not private.has_access('catalog.manage') then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_data is null or jsonb_typeof(p_data)<>'object'
    or p_data - array['sku','name','nominal_weight_grams','unit_price','currency','active']::text[] <> '{}'::jsonb then
    raise exception 'Invalid product fields' using errcode='22023';
  end if;
  if nullif(trim(p_data->>'sku'),'') is null or nullif(trim(p_data->>'name'),'') is null then
    raise exception 'Code and name required' using errcode='22023';
  end if;

  if nullif(p_data->>'unit_price','') is not null and (p_data->>'unit_price') !~ '^[0-9]{1,10}(\.[0-9]{1,2})?$' then
    raise exception 'Invalid price' using errcode='22023';
  end if;
  if p_id is null then
    insert into public.commercial_products(sku,name,nominal_weight_grams,unit_price,currency,active,updated_by)
    values(upper(trim(p_data->>'sku')),trim(p_data->>'name'),nullif(p_data->>'nominal_weight_grams','')::integer,
      nullif(p_data->>'unit_price','')::numeric,upper(nullif(trim(p_data->>'currency'),'')),
      coalesce((p_data->>'active')::boolean,false),auth.uid()) returning id into result_id;
  else
    select version into current_version from public.commercial_products where id=p_id for update;
    if not found then raise exception 'Product not found' using errcode='P0002'; end if;
    if p_version is null or p_version<>current_version then raise exception 'Record changed' using errcode='40001'; end if;
    update public.commercial_products set sku=upper(trim(p_data->>'sku')),name=trim(p_data->>'name'),
      nominal_weight_grams=nullif(p_data->>'nominal_weight_grams','')::integer,
      unit_price=nullif(p_data->>'unit_price','')::numeric,currency=upper(nullif(trim(p_data->>'currency'),'')),
      active=coalesce((p_data->>'active')::boolean,false),updated_by=auth.uid(),updated_at=now(),version=version+1
      where id=p_id returning id into result_id;
  end if;
  return result_id;
end;
$$;

create function public.save_commercial_customer(p_id uuid,p_version integer,p_data jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare result_id uuid; current_version integer;
begin
  if not private.has_access('customers.manage') then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_data is null or jsonb_typeof(p_data)<>'object' or p_data - array['name','phone']::text[] <> '{}'::jsonb
    or nullif(trim(p_data->>'name'),'') is null or nullif(trim(p_data->>'phone'),'') is null then
    raise exception 'Invalid customer' using errcode='22023';
  end if;
  if p_id is null then
    insert into public.commercial_customers(name,phone,updated_by)
    values(trim(p_data->>'name'),trim(p_data->>'phone'),auth.uid()) returning id into result_id;
  else
    select version into current_version from public.commercial_customers where id=p_id for update;
    if not found then raise exception 'Customer not found' using errcode='P0002'; end if;
    if p_version is null or p_version<>current_version then raise exception 'Record changed' using errcode='40001'; end if;
    update public.commercial_customers set name=trim(p_data->>'name'),phone=trim(p_data->>'phone'),
      updated_by=auth.uid(),updated_at=now(),version=version+1 where id=p_id returning id into result_id;
  end if;
  return result_id;
end;
$$;

create function public.save_commercial_address(p_id uuid,p_customer_id uuid,p_version integer,p_data jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare result_id uuid; current_row public.commercial_addresses;
begin
  if not private.has_access('customers.manage') then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_data is null or jsonb_typeof(p_data)<>'object' or p_data - array['address_text','notes']::text[] <> '{}'::jsonb
    or nullif(trim(p_data->>'address_text'),'') is null then
    raise exception 'Invalid address' using errcode='22023';
  end if;
  if p_id is null then
    insert into public.commercial_addresses(customer_id,address_text,notes,updated_by)
    values(p_customer_id,trim(p_data->>'address_text'),nullif(trim(p_data->>'notes'),''),auth.uid()) returning id into result_id;
  else
    select * into current_row from public.commercial_addresses where id=p_id for update;
    if not found or current_row.customer_id<>p_customer_id then raise exception 'Address not found' using errcode='P0002'; end if;
    if p_version is null or p_version<>current_row.version then raise exception 'Record changed' using errcode='40001'; end if;
    update public.commercial_addresses set address_text=trim(p_data->>'address_text'),notes=nullif(trim(p_data->>'notes'),''),
      latitude=null,longitude=null,location_verified_at=null,
      updated_by=auth.uid(),updated_at=now(),version=version+1 where id=p_id returning id into result_id;
  end if;
  return result_id;
end;
$$;

create function public.save_manual_order_draft(p_id uuid,p_key uuid,p_version integer,p_data jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare
  result_id uuid; previous public.commercial_orders; selected_customer public.commercial_customers;
  selected_address public.commercial_addresses; product public.commercial_products;
  line jsonb; qty integer; selected_currency text; has_currency boolean:=false;
  before_items jsonb; after_items jsonb; request_hash text; currency_complete boolean:=true;
begin
  if not private.has_access('orders.create_manual') then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_data is null or jsonb_typeof(p_data)<>'object'
    or p_data - array['customer_id','address_id','reason','items']::text[] <> '{}'::jsonb
    or nullif(trim(p_data->>'reason'),'') is null
    or jsonb_typeof(p_data->'items') is distinct from 'array' then
    raise exception 'Invalid draft fields' using errcode='22023';
  end if;
  if jsonb_array_length(p_data->'items')>100 then raise exception 'Too many items' using errcode='22023'; end if;
  request_hash:=encode(sha256(convert_to(p_data::text,'UTF8')),'hex');
  if p_id is null then
    if p_key is null then raise exception 'Request key required' using errcode='22023'; end if;
    perform pg_advisory_xact_lock(hashtextextended('manual-order:'||p_key::text,0));
    select * into previous from public.commercial_orders where idempotency_key=p_key::text;
    if found then
      if previous.created_by<>auth.uid() or previous.source<>'manual' or previous.creation_request_hash is distinct from request_hash then
        raise exception 'Request key already used' using errcode='22023';
      end if;
      return previous.id;
    end if;
  else
    select * into previous from public.commercial_orders where id=p_id for update;
    if not found then raise exception 'Order not found' using errcode='P0002'; end if;
    if previous.source<>'manual' or previous.status<>'draft' then raise exception 'Draft required' using errcode='22023'; end if;
    if p_version is null or p_version<>previous.version then raise exception 'Record changed' using errcode='40001'; end if;
    select coalesce(jsonb_agg(to_jsonb(i) order by i.id),'[]'::jsonb) into before_items
      from public.commercial_order_items i where i.order_id=p_id;
  end if;

  if nullif(p_data->>'customer_id','') is not null then
    select * into selected_customer from public.commercial_customers where id=(p_data->>'customer_id')::uuid for share;
    if not found then raise exception 'Customer not found' using errcode='23503'; end if;
  end if;
  if nullif(p_data->>'address_id','') is not null then
    select * into selected_address from public.commercial_addresses where id=(p_data->>'address_id')::uuid for share;
    if not found or selected_customer.id is null or selected_address.customer_id<>selected_customer.id then
      raise exception 'Address does not belong to customer' using errcode='23514';
    end if;
  end if;

  if p_id is null then
    insert into public.commercial_orders(idempotency_key,creation_request_hash,source,manual_reason,created_by,
      customer_id,address_id,recipient_name,recipient_phone,delivery_address_text)
    values(p_key::text,request_hash,'manual',trim(p_data->>'reason'),auth.uid(),
      selected_customer.id,selected_address.id,selected_customer.name,selected_customer.phone,selected_address.address_text)
    returning id into result_id;
  else
    result_id:=p_id;
    update public.commercial_orders set manual_reason=trim(p_data->>'reason'),customer_id=selected_customer.id,
      address_id=selected_address.id,recipient_name=selected_customer.name,recipient_phone=selected_customer.phone,
      delivery_address_text=selected_address.address_text,latitude=null,longitude=null,
      coverage_status='unchecked',coverage_checked_at=null,updated_at=now(),version=version+1 where id=p_id;
    delete from public.commercial_order_items where order_id=p_id;
  end if;

  for line in select value from jsonb_array_elements(p_data->'items') loop
    if jsonb_typeof(line)<>'object' or line - array['product_id','quantity']::text[] <> '{}'::jsonb then
      raise exception 'Invalid item fields' using errcode='22023';
    end if;
    if nullif(line->>'product_id','') is null or (line->>'quantity') is null
      or (line->>'quantity') !~ '^[0-9]+$' then raise exception 'Invalid quantity' using errcode='22023'; end if;
    qty:=(line->>'quantity')::integer;
    if qty<=0 then raise exception 'Positive quantity required' using errcode='23514'; end if;
    select * into product from public.commercial_products where id=(line->>'product_id')::uuid for share;
    if not found then raise exception 'Product not found' using errcode='23503'; end if;
    if exists(select 1 from public.commercial_order_items where order_id=result_id and product_id=product.id) then
      raise exception 'Duplicate product' using errcode='22023';
    end if;
    if product.currency is null then currency_complete:=false; end if;
    if product.currency is not null then
      if has_currency and selected_currency<>product.currency then raise exception 'Mixed currencies' using errcode='22023'; end if;
      selected_currency:=product.currency;has_currency:=true;
    end if;
    insert into public.commercial_order_items(order_id,product_id,product_name,nominal_weight_grams,quantity,unit_price)
      values(result_id,product.id,product.name,product.nominal_weight_grams,qty,product.unit_price);
  end loop;
  update public.commercial_orders set currency=case when currency_complete then selected_currency else null end where id=result_id;
  select coalesce(jsonb_agg(to_jsonb(i) order by i.id),'[]'::jsonb) into after_items
    from public.commercial_order_items i where i.order_id=result_id;
  insert into public.commercial_order_events(order_id,event_type,actor_type,actor_id,details)
    values(result_id,case when p_id is null then 'draft.created' else 'draft.updated' end,'staff',auth.uid(),
      jsonb_build_object('version',case when p_id is null then 1 else previous.version+1 end,
        'before',case when p_id is null then null else to_jsonb(previous) end,
        'before_items',before_items,'items',after_items,'reason',trim(p_data->>'reason')));
  return result_id;
end;
$$;

revoke all on function public.save_commercial_product(uuid,integer,jsonb),
 public.save_commercial_customer(uuid,integer,jsonb),public.save_commercial_address(uuid,uuid,integer,jsonb),
 public.save_manual_order_draft(uuid,uuid,integer,jsonb) from public,anon;
grant execute on function public.save_commercial_product(uuid,integer,jsonb),
 public.save_commercial_customer(uuid,integer,jsonb),public.save_commercial_address(uuid,uuid,integer,jsonb),
 public.save_manual_order_draft(uuid,uuid,integer,jsonb) to authenticated;

notify pgrst, 'reload schema';
commit;
