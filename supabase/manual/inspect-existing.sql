-- Solo lectura. Ejecutar en SQL Editor para revisar el proyecto ANTES de retirar objetos.
select table_schema,table_name,table_type from information_schema.tables
where table_schema in ('public','auth') order by table_schema,table_name;
select schemaname,tablename,policyname,roles,cmd from pg_policies
where schemaname='public' order by tablename,policyname;
select schemaname,relname,n_live_tup as approximate_rows from pg_stat_user_tables
where schemaname='public' order by relname;
select n.nspname as schema_name,p.proname as function_name
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname in ('public','private') order by 1,2;
-- No muestra correos, contraseñas ni tokens.
select count(*) as existing_auth_accounts from auth.users;
