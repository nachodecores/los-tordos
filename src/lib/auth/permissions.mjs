export const ROLES = Object.freeze({
  admin: "Administración", reparto: "Reparto",
  cobranzas: "Cobranzas",
});
const grants = {
  admin: ["stock.manage", "stock.read", "catalog.manage", "customers.manage", "users.manage", "deliveries.manage", "deliveries.operate", "collections.manage"],
  reparto: ["stock.read", "deliveries.operate"],
  cobranzas: ["collections.manage"],
};
export function hasPermission(roles, permission) {
  return roles.some((role) => grants[role]?.includes(permission));
}
export function normalizeEmail(value) {
  const email = String(value ?? "").trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Ingresá un correo válido.");
  return email;
}
export function validateRoles(values) {
  const roles = [...new Set(values)];
  if (!roles.length || roles.some((role) => !Object.hasOwn(ROLES, role))) throw new Error("Seleccioná al menos un rol válido.");
  return roles;
}
