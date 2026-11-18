import test from "node:test";
import assert from "node:assert/strict";
import { money, phone, productData } from "../src/lib/commercial/validation.mjs";
import { formatMoney } from "../src/lib/commercial/format.mjs";
test("los precios aceptan coma decimal sin redondear ni confundir separadores de miles", () => {
  assert.equal(money("390,50"), "390.50");
  assert.equal(money("0.1"), "0.10");
  assert.equal(money(""), null);
  for (const value of ["-1","0","10.001","1.000,00","1e3","Infinity"]) assert.throws(() => money(value));
});
test("los importes grandes se presentan sin perder centavos", () => {
  assert.equal(formatMoney("1234567890123456.78"), "UYU 1.234.567.890.123.456,78");
  assert.equal(formatMoney(null), "Sin definir");
});
test("teléfonos se normalizan sin inventar el país", () => {
  assert.equal(phone("+598 (99) 123-456"), "+59899123456");
  assert.throws(() => phone("099123456"));
});
test("producto incompleto no se puede habilitar", () => {
  const form = new FormData();
  form.set("sku", " p-1 "); form.set("name", "Provolone");
  assert.equal(productData(form).active, false);
  form.set("active", "on");
  assert.throws(() => productData(form));
  form.set("nominal_weight_grams", "450"); form.set("unit_price", "390");
  assert.equal(productData(form).active, true);
  assert.equal(Object.hasOwn(productData(form), "currency"), false);
});
