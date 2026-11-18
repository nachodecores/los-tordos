import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { database } from "./helpers/database.mjs";
const sql = await readFile(new URL("../supabase/migrations/202611130002_uyu_only.sql", import.meta.url), "utf8");

test("la migracion fija UYU sin cambiar precios ni borrar registros existentes", async () => {
  const db = await database({ through: "202611130001_commercial_drafts.sql" });
  try {
    await db.exec("insert into public.commercial_products(sku,name,unit_price) values('TEST','Test',390.50)");
    await db.exec(sql);
    const row = (await db.query("select currency,unit_price::text as price,version from public.commercial_products")).rows[0];
    assert.deepEqual(row, { currency: "UYU", price: "390.50", version: 1 });
  } finally { await db.close(); }
});
test("la migracion se detiene ante importes de otra moneda sin reinterpretarlos", async () => {
  const db = await database({ through: "202611130001_commercial_drafts.sql" });
  try {
    await db.exec("insert into public.commercial_products(sku,name,unit_price,currency) values('TEST','Test',10,'USD')");
    await assert.rejects(db.exec(sql), /Hay registros en otra moneda/);
    await db.exec("rollback");
    const row = (await db.query("select currency,unit_price::text as price from public.commercial_products")).rows[0];
    assert.deepEqual(row, { currency: "USD", price: "10.00" });
  } finally { await db.close(); }
});

test("la migracion de direccion unica se detiene sin borrar duplicados", async () => {
  const db = await database({ through: "202611130002_uyu_only.sql" });
  try {
    await db.exec("insert into public.commercial_customers(name,phone) values('Test','+59899123456')");
    await db.exec("insert into public.commercial_addresses(customer_id,address_text) select id,'Uno' from public.commercial_customers");
    await db.exec("insert into public.commercial_addresses(customer_id,address_text) select id,'Dos' from public.commercial_customers");
    const migration = await readFile(new URL("../supabase/migrations/202611130003_single_customer_address.sql", import.meta.url), "utf8");
    await assert.rejects(db.exec(migration), /Hay clientes con varias direcciones/);
    await db.exec("rollback");
    assert.equal((await db.query("select count(*)::integer as n from public.commercial_addresses")).rows[0].n, 2);
  } finally { await db.close(); }
});
