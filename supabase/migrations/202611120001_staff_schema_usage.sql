-- Permite resolver las tablas y RPC del módulo sin conceder CREATE ni permisos nuevos sobre sus datos.
begin;
grant usage on schema public to authenticated;
commit;
