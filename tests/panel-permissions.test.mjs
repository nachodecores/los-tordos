import test from "node:test";
import assert from "node:assert/strict";
import { getPanelContent } from "../src/lib/admin/panel.mjs";

test("administración ve los seis resúmenes y las herramientas de gestión", () => {
  const panel = getPanelContent(["admin"]);
  assert.equal(panel.summaries.length, 6);
  assert.equal(panel.navigation.some(item => item.href === "/admin/orders"), false);
  assert.equal(panel.showMap, true);
  assert.equal(panel.showAlerts, true);
  assert.equal(panel.navigation.some((item) => item.href === "/admin/users"), true);
});
test("reparto ve su operación sin información financiera ni acceso a usuarios", () => {
  const panel = getPanelContent(["reparto"]);
  assert.equal(panel.showMap, true);
  assert.deepEqual(panel.summaries.map((item) => item.id), ["available", "reserved", "stock"]);
  assert.equal(panel.summaries.find((item) => item.id === "stock").title, "Mi stock");
  assert.equal(panel.showAlerts, false);
  assert.equal(panel.navigation.some((item) => item.href === "/admin/users"), false);
});
test("cobranzas no recibe navegación logística ni inventario", () => {
  const panel = getPanelContent(["cobranzas"]);
  assert.equal(panel.showMap, false);
  assert.deepEqual(panel.summaries.map((item) => item.id), ["unpaid", "paid"]);
  assert.equal(panel.upcoming.some((item) => item.icon === "map"), false);
});
test("reparto y cobranzas combinan sus accesos sin administrar usuarios", () => {
  const panel=getPanelContent(["reparto","cobranzas"]);
  assert.equal(panel.summaries.length,5);
  assert.equal(panel.manageUsers,false);
  assert.equal(panel.navigation.some(item=>item.href==="/admin/stock"),true);
});

test("un rol histórico o desconocido no habilita herramientas de venta directa", () => {
  for (const roles of [["mayorista"], ["logistica"], ["unknown"], []]) {
    const panel = getPanelContent(roles);
    assert.equal(panel.showMap, false);
    assert.equal(panel.showAlerts, false);
    assert.deepEqual(panel.summaries, []);
    assert.deepEqual(panel.navigation.map((item) => item.href), ["/admin", "/admin/account"]);
  }
});
