import { describe, test, before, after, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { database, actor, ids } from "./helpers/database.mjs";

let db;
async function scalar(sql, params) { return Object.values((await db.query(sql, params)).rows[0])[0]; }
async function product(data = {}) {
  return scalar("select public.save_commercial_product(null,null,$1::jsonb)", [JSON.stringify({ sku: randomUUID(), name: "Producto", ...data })]);
}
async function customer() {
  return scalar("select public.save_commercial_customer(null,null,$1::jsonb)", [JSON.stringify({ name: "Cliente", phone: "+59899123456" })]);
}
async function rejects(sql, params, pattern) {
  await db.exec("savepoint invalid_operation");
  try { await assert.rejects(db.query(sql, params), pattern); }
  finally { await db.exec("rollback to savepoint invalid_operation; release savepoint invalid_operation"); }
}
describe("catalogo y clientes con permisos reales", () => {
  before(async () => { db = await database(); });
  after(async () => { await db?.close(); });
  beforeEach(async () => { await db.exec("begin"); await actor(db, "admin"); });
  afterEach(async () => { await db.exec("rollback; reset role"); });

  test("un producto incompleto queda deshabilitado, sin precio y en UYU", async () => {
    const p = await product();
    const row = (await db.query("select active,unit_price,currency from public.commercial_products where id=$1", [p])).rows[0];
    assert.deepEqual(row, { active: false, unit_price: null, currency: "UYU" });
    await rejects("select public.save_commercial_product(null,null,$1::jsonb)", [JSON.stringify({ sku: "X", name: "X", active: true })], /check constraint/);
  });
  test("el precio no se redondea silenciosamente ni admite otras monedas", async () => {
    await rejects("select public.save_commercial_product(null,null,$1::jsonb)", [JSON.stringify({ sku: "X", name: "X", unit_price: "10.001" })], /Invalid price/);
    await rejects("select public.save_commercial_product(null,null,$1::jsonb)", [JSON.stringify({ sku: "X", name: "X", currency: "USD" })], /Invalid product fields/);
  });
  test("clientes: telefono unico y edicion con version", async () => {
    const c = await customer();
    await rejects("select public.save_commercial_customer(null,null,$1::jsonb)", [JSON.stringify({ name: "Duplicado", phone: "+59899123456" })], /duplicate key/);
    await scalar("select public.save_commercial_customer($1,1,$2::jsonb)", [c, JSON.stringify({ name: "Editado", phone: "+59899123456" })]);
    assert.equal(await scalar("select name from public.commercial_customers where id=$1", [c]), "Editado");
    await rejects("select public.save_commercial_customer($1,1,$2::jsonb)", [c, JSON.stringify({ name: "Viejo", phone: "+59899123456" })], /Record changed/);
  });
  test("una direccion editable por cliente sin duplicados ni ediciones viejas", async () => {
    const c = await customer();
    const a = await scalar("select public.save_commercial_address(null,$1,null,$2::jsonb)", [c, JSON.stringify({ address_text: "Original" })]);
    await rejects("select public.save_commercial_address(null,$1,null,$2::jsonb)", [c, JSON.stringify({ address_text: "Duplicada" })], /duplicate key/);
    await scalar("select public.save_commercial_address($1,$2,1,$3::jsonb)", [a,c,JSON.stringify({ address_text: "Nueva" })]);
    assert.equal(await scalar("select address_text from public.commercial_addresses where id=$1", [a]), "Nueva");
    await rejects("select public.save_commercial_address($1,$2,1,$3::jsonb)", [a,c,JSON.stringify({ address_text: "Vieja" })], /Record changed/);
  });
  test("borradores retirados: no hay RPC ni permisos de pedidos para ningun rol", async () => {
    for (const role of Object.keys(ids)) {
      await actor(db, role);
      assert.equal(await scalar("select private.has_access('orders.create_manual')"), false);
      assert.equal(await scalar("select private.has_access('orders.read')"), false);
      await rejects("select public.save_manual_order_draft(null::uuid,null::uuid,null::integer,'{}'::jsonb)", [], /does not exist/);
      for (const table of ["commercial_orders","commercial_order_items","commercial_order_events","commercial_order_summaries","commercial_order_item_details"]) {
        await rejects("select * from public."+table, [], /permission denied/);
      }
    }
  });
  test("otros roles no leen clientes ni productos ni pueden crearlos", async () => {
    await customer(); await product();
    for (const role of ["reparto","cobranzas"]) {
      await actor(db, role);
      assert.equal(await scalar("select count(*) from public.commercial_customers"), 0);
      assert.equal(await scalar("select count(*) from public.commercial_products"), 0);
      await rejects("select public.save_commercial_customer(null,null,$1::jsonb)", [JSON.stringify({name:"Intento",phone:"+59899876543"})], /Forbidden/);
    }
  });
  test("ni administracion puede escribir directamente en clientes", async () => {
    await customer();
    await rejects("update public.commercial_customers set name='Manipulado'", [], /permission denied/);
  });
  test("una cuenta desactivada pierde el acceso comercial", async () => {
    await db.exec("reset role");
    await db.query("update public.staff_profiles set active=false where id=$1", [ids.admin]);
    await actor(db,"admin");
    await rejects("select public.save_commercial_product(null,null,$1::jsonb)", [JSON.stringify({sku:"X",name:"X"})], /Forbidden/);
  });
});
