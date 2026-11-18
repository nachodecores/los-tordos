import { describe,test,before,after,beforeEach,afterEach } from "node:test";
import assert from "node:assert/strict";
import { database,actor } from "./helpers/database.mjs";
let db;
const data = {name:"Cliente",phone:"+59899123456",address_text:"Direccion original",notes:"Porteria"};
async function save(id=null,version=null,addressVersion=null,fields=data) {
 return (await db.query("select public.save_commercial_customer_form($1,$2,$3,$4::jsonb) as id",[id,version,addressVersion,JSON.stringify(fields)])).rows[0].id;
}
async function rejected(fn,pattern) {
 await db.exec("savepoint invalid");
 try { await assert.rejects(fn,pattern); }
 finally { await db.exec("rollback to savepoint invalid; release savepoint invalid"); }
}
describe("guardado unificado de clientes",()=>{
 before(async()=>{db=await database();});
 after(async()=>{await db.close();});
 beforeEach(async()=>{await db.exec("begin");await actor(db,"admin");});
 afterEach(async()=>{await db.exec("rollback; reset role");});
 test("crea y edita contacto y direccion en una operacion",async()=>{
  const id=await save();
  await save(id,1,1,{...data,name:"Editado",address_text:"Nueva direccion"});
  const row=(await db.query("select c.name,c.version,a.address_text,a.version as address_version from public.commercial_customers c join public.commercial_addresses a on a.customer_id=c.id where c.id=$1",[id])).rows[0];
  assert.deepEqual(row,{name:"Editado",version:2,address_text:"Nueva direccion",address_version:2});
 });
 test("permite crear sin direccion y agregarla desde la misma ficha",async()=>{
  const id=await save(null,null,null,{name:data.name,phone:data.phone});
  await save(id,1,null,data);
  assert.equal((await db.query("select count(*)::int as n from public.commercial_addresses where customer_id=$1",[id])).rows[0].n,1);
 });
 test("un error de direccion revierte tambien el alta del cliente",async()=>{
  await rejected(()=>save(null,null,null,{...data,address_text:"",notes:"Observacion sin direccion"}),/Invalid address/);
  assert.equal((await db.query("select count(*)::int as n from public.commercial_customers")).rows[0].n,0);
 });
 test("una direccion editada en otra pestaña revierte el cambio de contacto",async()=>{
  const id=await save();
  await db.exec("reset role");
  await db.query("update public.commercial_addresses set version=2 where customer_id=$1",[id]);
  await actor(db,"admin");
  await rejected(()=>save(id,1,1,{...data,name:"No guardar"}),/Record changed/);
  assert.equal((await db.query("select name,version from public.commercial_customers where id=$1",[id])).rows[0].name,"Cliente");
  await rejected(()=>save(id,1,2,{...data,address_text:"",notes:null}),/Address required/);
 });
 test("contacto y observaciones conservan ubicacion; cambiar direccion la invalida",async()=>{
  const id=await save();
  await db.exec("reset role");
  await db.query("update public.commercial_addresses set latitude=-34.9,longitude=-56.2,location_verified_at=now() where customer_id=$1",[id]);
  await actor(db,"admin");
  await save(id,1,1,{...data,name:"Otro nombre",notes:"Nueva observacion"});
  let row=(await db.query("select latitude,location_verified_at,version from public.commercial_addresses where customer_id=$1",[id])).rows[0];
  assert.ok(row.latitude);assert.ok(row.location_verified_at);assert.equal(row.version,2);
  await save(id,2,2,{...data,address_text:"Otra calle"});
  row=(await db.query("select latitude,location_verified_at from public.commercial_addresses where customer_id=$1",[id])).rows[0];
  assert.equal(row.latitude,null);assert.equal(row.location_verified_at,null);
 });
 test("los roles sin administracion no pueden usar la nueva funcion",async()=>{
  for(const role of ["reparto","cobranzas"]){
   await actor(db,role);await rejected(()=>save(),/Forbidden/);
  }
 });
});
