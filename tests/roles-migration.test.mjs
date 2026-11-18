import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {database,actor,ids} from "./helpers/database.mjs";
const migration=await readFile(new URL("../supabase/migrations/202611130008_simplify_roles.sql",import.meta.url),"utf8");
const legacyId="00000000-0000-4000-8000-000000000098";
async function legacy(db,roles,createUser=true){
 await db.query("insert into public.staff_invitations(email,name,roles) values('legacy@example.com','Anterior',$1)",[roles]);
 if(createUser)await db.query("insert into auth.users(id,email) values($1,'legacy@example.com')",[legacyId]);
}
test("retira roles de asignaciones mixtas conservando usuarios, permisos vigentes y auditoria",async()=>{
 const db=await database({through:"202611130007_courier_stock.sql"});
 try{
  await legacy(db,["reparto","logistica","mayorista"]);
  await db.exec(migration);
  const profile=(await db.query("select roles from public.staff_profiles where id=$1",[legacyId])).rows[0];
  assert.deepEqual(profile.roles,["reparto"]);
  assert.deepEqual((await db.query("select roles from public.staff_invitations where email='legacy@example.com'")).rows[0].roles,["reparto"]);
  assert.equal((await db.query("select count(*)::int as n from public.access_audit where action='roles.retired'")).rows[0].n,1);
  assert.equal((await db.query("select count(*)::int as n from auth.users where id=$1",[legacyId])).rows[0].n,1);
 }finally{await db.close();}
});
test("si una cuenta queda sin rol la migracion revierte todo",async()=>{
 const db=await database({through:"202611130007_courier_stock.sql"});
 try{
  await legacy(db,["logistica"]);
  await assert.rejects(db.exec(migration),/sin un rol vigente/);await db.exec("rollback");
  assert.deepEqual((await db.query("select roles from public.staff_profiles where id=$1",[legacyId])).rows[0].roles,["logistica"]);
  assert.equal((await db.query("select count(*)::int as n from public.access_audit where action='roles.retired'")).rows[0].n,0);
 }finally{await db.close();}
});
test("una invitacion pendiente exclusivamente antigua tambien exige revision",async()=>{
 const db=await database({through:"202611130007_courier_stock.sql"});
 try{
  await legacy(db,["mayorista"],false);
  await assert.rejects(db.exec(migration),/sin un rol vigente/);await db.exec("rollback");
  assert.deepEqual((await db.query("select roles from public.staff_invitations where email='legacy@example.com'")).rows[0].roles,["mayorista"]);
 }finally{await db.close();}
});
test("API y restricciones rechazan roles retirados y mantienen cobranzas",async()=>{
 const db=await database();
 async function rejected(sql,args,pattern){
  await db.exec("savepoint invalid");
  try{await assert.rejects(db.query(sql,args),pattern);}finally{await db.exec("rollback to savepoint invalid;release savepoint invalid");}
 }
 try{
  await db.exec("begin");await actor(db,"admin");
  for(const role of ["logistica","mayorista"]){
   await rejected("select public.reserve_staff_invitation('invalid@example.com','Prueba',$1)",[[role]],/Invalid invitation/);
   await rejected("select public.update_staff_access($1,'Prueba',$2,true)",[ids.reparto,[role]],/Invalid access/);
  }
  assert.equal((await db.query("select private.has_access('logistics.manage') as allowed")).rows[0].allowed,false);
  assert.equal((await db.query("select private.has_access('wholesale.own') as allowed")).rows[0].allowed,false);
  await actor(db,"cobranzas");
  assert.equal((await db.query("select private.has_access('collections.manage') as allowed")).rows[0].allowed,true);
  await db.exec("reset role");
  for(const role of ["logistica","mayorista"]){
   await rejected("update public.staff_profiles set roles=$1 where id=$2",[[role],ids.reparto],/check constraint/);
   await rejected("insert into public.staff_invitations(email,name,roles) values('invalid@example.com','Prueba',$1)",[[role]],/check constraint/);
  }
  await db.exec("rollback");
 }finally{await db.close();}
});
