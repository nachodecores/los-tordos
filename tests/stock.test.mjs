import {describe,test,before,after,beforeEach,afterEach} from "node:test";
import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import {database,actor,ids,sessionId} from "./helpers/database.mjs";
import {stockData} from "../src/lib/stock/validation.mjs";
let db,product;
const other="00000000-0000-4000-8000-000000000099";
async function scalar(sql,args){return Object.values((await db.query(sql,args)).rows[0])[0];}
async function move({key=randomUUID(),courier=ids.reparto,kind="entry",quantity=10,version=null,reason=null}={}){
 return scalar("select public.record_commercial_stock($1,$2,$3,$4,$5,$6,$7)",[key,courier,product,kind,quantity,version,reason]);
}
async function rejects(fn,pattern){
 await db.exec("savepoint invalid");try{await assert.rejects(fn,pattern);}finally{await db.exec("rollback to savepoint invalid;release savepoint invalid");}
}
test("valida entradas y correcciones con motivo y paquetes enteros",()=>{
 const f=new FormData();
 for(const [k,v] of Object.entries({request_key:randomUUID(),courier_id:ids.reparto,product_id:randomUUID(),kind:"entry",quantity:"2"}))f.set(k,v);
 assert.equal(stockData(f).p_quantity,2);
 for(const invalid of ["0","-1","1.5","Infinity","2147483648"]) {f.set("quantity",invalid);assert.throws(()=>stockData(f));}
 f.set("kind","correction");f.set("quantity","0");assert.throws(()=>stockData(f));
 f.set("reason","Conteo real");assert.equal(stockData(f).p_quantity,0);
});
describe("cuenta corriente de stock en PostgreSQL",()=>{
 before(async()=>{db=await database();});
 after(async()=>{await db.close();});
 beforeEach(async()=>{
  await db.exec("begin");await actor(db,"admin");
  product=await scalar("select public.save_commercial_product(null,null,$1::jsonb)",[JSON.stringify({sku:"TEST",name:"Producto"})]);
 });
 afterEach(async()=>{await db.exec("rollback;reset role");});
 test("no precarga saldos ni movimientos",async()=>{
  assert.equal(await scalar("select count(*) from public.commercial_stock_accounts"),0);
  assert.equal(await scalar("select count(*) from public.commercial_stock_movements"),0);
 });
 test("entrada y correcciones mantienen saldo e historial consistente",async()=>{
  await move();
  await move({kind:"correction",quantity:7,version:1,reason:"Conteo fisico"});
  await move({kind:"correction",quantity:0,version:2,reason:"Devolucion"});
  const row=(await db.query("select balance,version from public.commercial_stock_accounts")).rows[0];
  assert.deepEqual(row,{balance:0,version:3});
  assert.equal(Number(await scalar("select sum(delta) from public.commercial_stock_movements")),0);
  assert.equal(await scalar("select count(*) from public.commercial_stock_movements"),3);
  assert.equal(await scalar("select count(*) from public.commercial_stock_movements where actor_id=$1",[ids.admin]),3);
 });
 test("un reintento no duplica movimientos y una clave no sirve para otro contenido",async()=>{
  const key=randomUUID(),id=await move({key});
  assert.equal(await move({key}),id);
  assert.equal(await scalar("select count(*) from public.commercial_stock_movements"),1);
  await rejects(()=>move({key,quantity:20}),/Request key already used/);
  assert.equal(await scalar("select balance from public.commercial_stock_accounts"),10);
 });
 test("version vieja no pisa el saldo y no agrega historial",async()=>{
  await move();await move({quantity:5,version:1});
  await rejects(()=>move({kind:"correction",quantity:2,version:1,reason:"Pantalla vieja"}),/Record changed/);
  assert.equal(await scalar("select balance from public.commercial_stock_accounts"),15);
  assert.equal(await scalar("select count(*) from public.commercial_stock_movements"),2);
 });
 test("rechaza cantidades invalidas, motivos ausentes y ajustes sin diferencia",async()=>{
  for(const value of [-1,0])await rejects(()=>move({quantity:value}),/Invalid movement/);
  await rejects(()=>move({kind:"correction",quantity:2}),/Invalid movement/);
  await move();
  await rejects(()=>move({kind:"correction",quantity:10,version:1,reason:"Sin cambio"}),/Balance unchanged/);
  await rejects(()=>move({quantity:2147483647,version:1}),/Invalid balance/);
  assert.equal(await scalar("select balance from public.commercial_stock_accounts"),10);
 });
 test("entradas solo para repartidores activos; cuentas historicas admiten correccion",async()=>{
  await rejects(()=>move({courier:ids.cobranzas}),/Active courier required/);
  await move();
  await db.exec("reset role");await db.query("update public.staff_profiles set active=false where id=$1",[ids.reparto]);await actor(db,"admin");
  await rejects(()=>move({version:1}),/Active courier required/);
  await move({kind:"correction",quantity:3,version:1,reason:"Cierre de cuenta"});
  assert.equal(await scalar("select balance from public.commercial_stock_accounts"),3);
 });
 test("reparto solo ve su cuenta e historial, sin permisos para editar ni ver precios",async()=>{
  await move();
  await db.exec("reset role");
  await db.query("insert into public.staff_invitations(email,name,roles) values('other@example.com','Otro',array['reparto'])");
  await db.query("insert into auth.users(id,email) values($1,'other@example.com')",[other]);
  await db.query("insert into auth.sessions(id,user_id) values($1,$2)",[sessionId(other),other]);
  await db.query("update public.staff_profiles set onboarding_required=false where id=$1",[other]);
  await actor(db,"admin");await move({courier:other,quantity:20});
  await actor(db,"reparto");
  assert.equal(await scalar("select count(*) from public.commercial_stock_balances()"),1);
  assert.equal(await scalar("select balance from public.commercial_stock_balances()"),10);
  assert.equal(await scalar("select count(*) from public.commercial_stock_history()"),1);
  assert.equal(await scalar("select count(*) from public.commercial_stock_accounts"),1);
  assert.equal(await scalar("select count(*) from public.commercial_stock_movements"),1);
  assert.equal(await scalar("select count(*) from public.commercial_products"),0);
  assert.equal(await scalar("select count(*) from public.commercial_customers"),0);
  await rejects(()=>db.query("select * from public.commercial_stock_history($1)",[other]),/Forbidden/);
  await rejects(()=>move({version:1}),/Forbidden/);
 });
 test("cobranzas no recibe acceso a stock",async()=>{
  await move();
  for(const role of ["cobranzas"]){
   await actor(db,role);
   assert.equal(await scalar("select count(*) from public.commercial_stock_accounts"),0);
   await rejects(()=>db.query("select * from public.commercial_stock_balances()"),/Forbidden/);
   await rejects(()=>move(),/Forbidden/);
  }
 });
 test("ni administracion puede alterar saldos o borrar movimientos directamente",async()=>{
  await move();
  await rejects(()=>db.exec("update public.commercial_stock_accounts set balance=100"),/permission denied/);
  await rejects(()=>db.exec("delete from public.commercial_stock_movements"),/permission denied/);
  await rejects(()=>db.exec("update public.commercial_stock_movements set reason='Cambio'"),/permission denied/);
  await db.exec("set role anon");
  await rejects(()=>db.query("select * from public.commercial_stock_accounts"),/permission denied/);
  await rejects(()=>db.query("select * from public.commercial_stock_history()"),/permission denied/);
 });
 test("historial paginado y filtro por repartidor",async()=>{
  for(let i=0;i<26;i++)await move({version:i===0?null:i,quantity:1});
  const first=(await db.query("select * from public.commercial_stock_history(null,1)")).rows;
  const second=(await db.query("select * from public.commercial_stock_history(null,2)")).rows;
  assert.equal(first.length,25);assert.equal(second.length,1);
  assert.equal(Number(first[0].total_count),26);
  assert.equal(new Set([...first,...second].map(x=>x.id)).size,26);
 });
});
