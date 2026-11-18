-- Moneda unica aprobada: pesos uruguayos. No convierte importes ni elimina registros.
begin;
lock table public.commercial_products, public.commercial_orders in access exclusive mode;
do $$
begin
  if exists(select 1 from public.commercial_products where currency is not null and currency <> 'UYU')
     or exists(select 1 from public.commercial_orders where currency is not null and currency <> 'UYU') then
    raise exception 'Hay registros en otra moneda. Revisar antes de continuar; no se convirtieron importes.';
  end if;
end;
$$;
update public.commercial_products set currency='UYU' where currency is null;
update public.commercial_orders set currency='UYU' where currency is null;
alter table public.commercial_products
  alter column currency set default 'UYU',
  alter column currency set not null,
  add constraint commercial_products_uyu_only check(currency='UYU');
alter table public.commercial_orders
  alter column currency set default 'UYU',
  alter column currency set not null,
  add constraint commercial_orders_uyu_only check(currency='UYU');

create or replace function public.save_commercial_product(p_id uuid,p_version integer,p_data jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare result_id uuid; current_version integer;
begin
  if not private.has_access('catalog.manage') then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_data is null or jsonb_typeof(p_data)<>'object'
    or p_data - array['sku','name','nominal_weight_grams','unit_price','active']::text[] <> '{}'::jsonb then
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
      nullif(p_data->>'unit_price','')::numeric,'UYU',
      coalesce((p_data->>'active')::boolean,false),auth.uid()) returning id into result_id;
  else
    select version into current_version from public.commercial_products where id=p_id for update;
    if not found then raise exception 'Product not found' using errcode='P0002'; end if;
    if p_version is null or p_version<>current_version then raise exception 'Record changed' using errcode='40001'; end if;
    update public.commercial_products set sku=upper(trim(p_data->>'sku')),name=trim(p_data->>'name'),
      nominal_weight_grams=nullif(p_data->>'nominal_weight_grams','')::integer,
      unit_price=nullif(p_data->>'unit_price','')::numeric,currency='UYU',
      active=coalesce((p_data->>'active')::boolean,false),updated_by=auth.uid(),updated_at=now(),version=version+1
      where id=p_id returning id into result_id;
  end if;
  return result_id;
end;
$$;

create or replace function public.save_manual_order_draft(p_id uuid,p_key uuid,p_version integer,p_data jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare
  result_id uuid; previous public.commercial_orders; selected_customer public.commercial_customers;
  selected_address public.commercial_addresses; product public.commercial_products;
  line jsonb; qty integer;
  before_items jsonb; after_items jsonb; request_hash text;
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
    insert into public.commercial_order_items(order_id,product_id,product_name,nominal_weight_grams,quantity,unit_price)
      values(result_id,product.id,product.name,product.nominal_weight_grams,qty,product.unit_price);
  end loop;
  update public.commercial_orders set currency='UYU' where id=result_id;
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

-- CREATE OR REPLACE conserva los permisos de ejecucion ya restringidos.
notify pgrst, 'reload schema';
commit;
