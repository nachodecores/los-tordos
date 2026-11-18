import {describe,test,before,after,beforeEach,afterEach} from "node:test";
import assert from "node:assert/strict";
import {database,actor} from "./helpers/database.mjs";
import {validateBoundary,pointCoverage,coordinate} from "../src/lib/geo/geometry.mjs";
const zone=[[-56.3,-34.9],[-56.1,-34.9],[-56.1,-34.7],[-56.3,-34.7]];
const crossed=[[-56.3,-34.9],[-56.1,-34.7],[-56.1,-34.9],[-56.3,-34.7]];
test("valida perimetros locales sin cruces, duplicados o superficie nula",()=>{
 assert.deepEqual(validateBoundary(zone),zone);
 for(const points of [crossed,zone.slice(0,2),[...zone,zone[0]],[[0,0],[1,1],[2,2]],[[0,0],[10,0],[0,1]],[[null,0],[1,1],[2,0]]]) assert.throws(()=>validateBoundary(points));
 assert.equal(coordinate("",-85,85),null);
 assert.throws(()=>coordinate("Infinity",-85,85));
});
let db;
async function scalar(sql,args){return Object.values((await db.query(sql,args)).rows[0])[0];}
async function save(points=zone,version=null,active=true){await db.query("select public.save_commercial_coverage($1,$2::jsonb,$3)",[version,JSON.stringify(points),active]);}
async function rejects(fn,pattern){
 await db.exec("savepoint invalid");
 try{await assert.rejects(fn,pattern);}finally{await db.exec("rollback to savepoint invalid;release savepoint invalid");}
}
describe("cobertura y ubicaciones en PostgreSQL",()=>{
 before(async()=>{db=await database();});
 after(async()=>{await db.close();});
 beforeEach(async()=>{await db.exec("begin");await actor(db,"admin");});
 afterEach(async()=>{await db.exec("rollback;reset role");});
 test("no habilita ninguna cobertura inicial",async()=>{
  assert.equal(await scalar("select count(*) from public.commercial_coverage"),0);
  assert.equal(await scalar("select public.commercial_point_coverage(-34.8,-56.2)"),"unchecked");
 });
 test("SQL y vista previa coinciden para interior, exterior, lados y vertices",async()=>{
  await save();
  for(const [point,expected] of [[[-56.2,-34.8],"covered"],[[-56,-34.8],"outside"],[[-56.3,-34.8],"ambiguous"],[zone[0],"ambiguous"]]){
   assert.equal(pointCoverage(point,zone),expected);
   assert.equal(await scalar("select public.commercial_point_coverage($1,$2)",[point[1],point[0]]),expected);
  }
  const concave=[[-56.3,-34.9],[-56.1,-34.9],[-56.1,-34.7],[-56.2,-34.8],[-56.3,-34.7]];
  await save(concave,1);
  for(const point of [[-56.2,-34.75],[-56.2,-34.85]])assert.equal(await scalar("select public.commercial_point_coverage($1,$2)",[point[1],point[0]]),pointCoverage(point,concave));
 });
 test("SQL rechaza geometria malformada y cruces sin dejar registros",async()=>{
  for(const points of [crossed,[],[...zone,zone[0]],[[null,1],[2,2],[3,1]],[[0,0],[1,1],[2,2]]]){
   await rejects(()=>save(points),/Invalid boundary/);
  }
  assert.equal(await scalar("select count(*) from public.commercial_coverage"),0);
 });
 test("versiones, desactivacion y auditoria",async()=>{
  await save();
  await rejects(()=>save(zone,null),/Record changed/);
  await save(zone,1,false);
  assert.equal(await scalar("select public.commercial_point_coverage(-34.8,-56.2)"),"unchecked");
  assert.equal(await scalar("select count(*) from public.access_audit where action='coverage.updated'"),2);
 });
 test("otros roles no ven ni modifican cobertura",async()=>{
  await save();
  for(const role of ["reparto","cobranzas"]){
   await actor(db,role);
   assert.equal(await scalar("select count(*) from public.commercial_coverage"),0);
   await rejects(()=>save(),/Forbidden/);
   await rejects(()=>db.query("select public.commercial_point_coverage(-34.8,-56.2)"),/Forbidden/);
  }
  await db.exec("set role anon");
  await rejects(()=>db.query("select * from public.commercial_coverage"),/permission denied/);
 });
 test("coordenas verificadas, invalidacion por direccion y validacion atomica",async()=>{
  const data={name:"Cliente",phone:"+59899123456",address_text:"Original",latitude:-34.8,longitude:-56.2};
  const id=await scalar("select public.save_commercial_customer_form(null,null,null,$1::jsonb)",[JSON.stringify(data)]);
  let row=(await db.query("select version,latitude,longitude,location_verified_at from public.commercial_addresses where customer_id=$1",[id])).rows[0];
  assert.ok(row.location_verified_at);assert.equal(Number(row.latitude),-34.8);
  await rejects(()=>db.query("select public.save_commercial_customer_form($1,1,$2,$3::jsonb)",[id,row.version,JSON.stringify({...data,name:"No guardar",latitude:100})]),/Invalid coordinates/);
  assert.equal(await scalar("select name from public.commercial_customers where id=$1",[id]),"Cliente");
  await db.query("select public.save_commercial_customer_form($1,1,$2,$3::jsonb)",[id,row.version,JSON.stringify({...data,address_text:"Nueva",latitude:null,longitude:null})]);
  row=(await db.query("select latitude,longitude,location_verified_at from public.commercial_addresses where customer_id=$1",[id])).rows[0];
  assert.deepEqual(row,{latitude:null,longitude:null,location_verified_at:null});
 });
});
