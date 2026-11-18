export function formatMoney(value) {
  if (value === null || value === undefined) return "Sin definir";
  const raw = String(value);
  if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(raw)) return "Importe no disponible";
  const [whole, fraction = ""] = raw.split(".");
  const grouped = new Intl.NumberFormat("es-UY").format(BigInt(whole));
  return `UYU ${grouped},${fraction.padEnd(2, "0")}`;
}
export function formatDate(value) {
  return new Intl.DateTimeFormat("es-UY", { dateStyle: "short", timeStyle: "short", timeZone: "America/Montevideo" }).format(new Date(value));
}
