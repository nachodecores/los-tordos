-- BORRADOR DE DISEÑO: fuera del directorio de migraciones aplicables.
-- No ejecutar en Supabase. Falta aprobar y completar las RPC y políticas de la entrega.
-- La transacción se revierte al final; no contiene datos ni parámetros comerciales iniciales.
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

-- Denegación inicial. La migración definitiva incorporará RPC transaccionales y políticas.
-- No se otorgan accesos incompletos ni escrituras directas durante la revisión del modelo.
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

-- Falta implementar antes de una migración aplicable:
-- 1. Permisos dedicados, por ejemplo orders.create_manual, exclusivos de administración.
-- 2. RPC para crear/editar borradores con auditoría e idempotencia en una transacción.
-- 3. Lectura por rol: reparto no puede consultar columnas financieras ni fichas de clientes.
-- 4. Confirmación: todas las líneas completas, total calculado en servidor y cobertura comprobada.
-- 5. Estados posteriores solo al implementar conjuntamente reparto, inventario y cobranza.
-- 6. Historial append-only y protección de snapshots de pedidos confirmados.
rollback;
