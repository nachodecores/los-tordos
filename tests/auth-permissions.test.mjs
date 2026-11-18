import test from "node:test";
import assert from "node:assert/strict";
import { hasPermission, normalizeEmail, validateRoles } from "../src/lib/auth/permissions.mjs";
test("roles vigentes y combinaciones mantienen separados reparto y cobranzas", () => {
  assert.equal(hasPermission(["reparto"], "collections.manage"), false);
  assert.equal(hasPermission(["mayorista"], "deliveries.operate"), false);
  assert.equal(hasPermission(["logistica"], "users.manage"), false);
  assert.equal(hasPermission(["reparto", "cobranzas"], "collections.manage"), true);
  assert.equal(hasPermission(["admin"], "users.manage"), true);
  assert.equal(hasPermission(["admin"], "unknown"), false);
});
test("entradas no permiten roles desconocidos ni correos inválidos", () => {
  assert.equal(normalizeEmail(" Persona@Example.com "), "persona@example.com");
  assert.deepEqual(validateRoles(["reparto", "reparto"]), ["reparto"]);
  for (const value of ["", "persona", "a@b", "a b@example.com"]) assert.throws(() => normalizeEmail(value));
  assert.throws(() => validateRoles([]));
  assert.throws(() => validateRoles(["admin", "owner"]));
  assert.throws(() => validateRoles(["toString"]));
  for (const role of ["logistica","mayorista"]) assert.throws(()=>validateRoles([role]));
});

test("la contraseña respeta el límite UTF-8 del proveedor y exige confirmación", async () => {
  const { validatePassword } = await import("../src/lib/auth/password.mjs");
  assert.equal(validatePassword("x".repeat(72), "x".repeat(72)), "x".repeat(72));
  assert.throws(() => validatePassword("x".repeat(73), "x".repeat(73)));
  assert.throws(() => validatePassword("á".repeat(40), "á".repeat(40)));
  assert.throws(() => validatePassword("corta", "corta"));
  assert.throws(() => validatePassword("contraseña larga", "otra contraseña"));
});
