export function text(value, label, max = 200, required = true) {
  const result = String(value ?? "").trim();
  if ((required && !result) || result.length > max) throw new Error(`Revisá ${label}.`);
  return result || null;
}
export function uuid(value, required = false) {
  const result = String(value ?? "").trim();
  if (!result && !required) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result)) throw new Error("El registro seleccionado no es válido.");
  return result;
}
export function positiveInteger(value, required = false) {
  const raw = String(value ?? "").trim();
  if (!raw && !required) return null;
  if (!/^[0-9]+$/.test(raw) || Number(raw) < 1 || Number(raw) > 2147483647) throw new Error("Ingresá una cantidad entera mayor que cero.");
  return Number(raw);
}
export function money(value) {
  const raw = String(value ?? "").trim().replace(",", ".");
  if (!raw) return null;
  if (!/^[0-9]{1,10}(\.[0-9]{1,2})?$/.test(raw)) throw new Error("Ingresá un precio positivo, con hasta dos decimales y sin separadores de miles.");
  const [whole, fraction = ""] = raw.split(".");
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
  if (cents <= 0n || cents > 999999999999n) throw new Error("El precio está fuera del rango permitido.");
  return `${BigInt(whole)}.${fraction.padEnd(2, "0")}`;
}
export function phone(value) {
  const result = String(value ?? "").trim().replace(/[\s()-]/g, "");
  if (!/^\+[1-9][0-9]{7,14}$/.test(result)) throw new Error("Incluí el código de país en el teléfono, por ejemplo +598…");
  return result;
}
export function productData(form) {
  const data = {
    sku: text(form.get("sku"), "el código interno", 60).toUpperCase(),
    name: text(form.get("name"), "el nombre", 160),
    nominal_weight_grams: positiveInteger(form.get("nominal_weight_grams")),
    unit_price: money(form.get("unit_price")),
    active: form.get("active") === "on",
  };
  if (data.active && (!data.nominal_weight_grams || !data.unit_price)) throw new Error("Para habilitar el producto, completá peso y precio.");
  return data;
}
