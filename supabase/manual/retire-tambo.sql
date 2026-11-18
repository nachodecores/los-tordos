-- NO EJECUTADO. Solo tras inspección y aprobación expresa.
-- Por defecto ensaya la operación y revierte todo con ROLLBACK.
-- No usa CASCADE: dependencias inesperadas detienen la operación.
begin;
drop view if exists public.eventos_auditoria;
drop table if exists public."Tacto";
drop table if exists public."Servicio";
drop table if exists public."Parto";
drop table if exists public."Secado";
drop table if exists public."Aborto";
drop table if exists public."PeriodoToro";
drop table if exists public."Animal";
drop table if exists public."Usuario";
drop table if exists public."_prisma_migrations";
drop type if exists public."TipoAnimal";
drop type if exists public."CategoriaVaca";
drop type if exists public."EstadoAnimal";
drop type if exists public."ResultadoTacto";
drop type if exists public."RolUsuario";
-- No tocar auth.*, storage.*, realtime ni otros objetos de Supabase.
-- Cambiar ROLLBACK por COMMIT solo después de revisar el resultado y aprobarlo.
rollback;
