import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicAuthConfig } from "./config";
export function createAdminClient() {
  const { url } = publicAuthConfig();
  if (!process.env.SUPABASE_SECRET_KEY) throw new Error("Invitaciones todavía no configuradas.");
  return createClient(url, process.env.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
