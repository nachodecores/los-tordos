export function isAuthConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && process.env.APP_URL);
}
export function publicAuthConfig() {
  if (!isAuthConfigured()) throw new Error("Acceso todavía no configurado.");
  return { url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY };
}
export function appUrl(path = "/admin") {
  const base = new URL(process.env.APP_URL);
  if (!["https:", "http:"].includes(base.protocol) || (base.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(base.hostname))) throw new Error("APP_URL inválida.");
  return new URL(path, base.origin).toString();
}
