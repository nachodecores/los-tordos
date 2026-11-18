export function isSetupError(error) {
  return ["PGRST202", "PGRST205", "42P01"].includes(error?.code);
}
export function saveError(error) {
  if (isSetupError(error)) return "Esta sección todavía no está habilitada para guardar.";
  if (error?.code === "40001") return "El registro cambió desde que lo abriste. Recargá la página antes de guardar.";
  if (error?.code === "23505") return "Ya existe un registro con ese código, teléfono o producto repetido.";
  if (error?.code === "42501") return "Tu cuenta ya no tiene permiso para realizar esta operación.";
  if (error?.code === "P0002") return "No encontramos el registro. Volvé al listado y recargá la página.";
  if (["22023", "23514", "23503", "22P02", "22003"].includes(error?.code)) return "Revisá los datos, las cantidades y que la dirección corresponda al cliente.";
  return "No pudimos guardar los cambios. Intentá nuevamente más tarde.";
}
