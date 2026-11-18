-- Una direccion actual por cliente. No borra direcciones ni modifica pedidos.
begin;
lock table public.commercial_addresses in access exclusive mode;
do $$
begin
  if exists(select 1 from public.commercial_addresses group by customer_id having count(*) > 1) then
    raise exception 'Hay clientes con varias direcciones. Revisar antes de continuar; no se elimino ninguna.';
  end if;
end;
$$;
alter table public.commercial_addresses
  add constraint commercial_addresses_one_per_customer unique(customer_id);
notify pgrst, 'reload schema';
commit;
