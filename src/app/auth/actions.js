"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { appUrl, isAuthConfigured } from "@/lib/supabase/config";
import { normalizeEmail } from "@/lib/auth/permissions.mjs";
import { validatePassword } from "@/lib/auth/password.mjs";
import { requireActor } from "@/lib/auth/access";

export async function login(_previous, form) {
  if (!isAuthConfigured()) return { error: "El acceso todavía no está habilitado." };
  let email;
  try { email = normalizeEmail(form.get("email")); } catch (error) { return { error: error.message }; }
  const password = String(form.get("password") || "");
  if (!password || password.length > 256) return { error: "Revisá el correo y la contraseña." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "No pudimos iniciar sesión. Revisá tus datos o intentá nuevamente más tarde." };
  redirect("/admin");
}
export async function logout() {
  if (isAuthConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "local" });
  }
  redirect("/auth/login");
}
export async function requestRecovery(_previous, form) {
  if (!isAuthConfigured()) return { error: "El acceso todavía no está habilitado." };
  let email;
  try { email = normalizeEmail(form.get("email")); } catch (error) { return { error: error.message }; }
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: appUrl("/auth/confirm") });
  return { success: "Si el correo corresponde a una cuenta, recibirás instrucciones para recuperar el acceso." };
}
export async function confirmLink(_previous, form) {
  if (!isAuthConfigured()) return { error: "El acceso todavía no está habilitado." };
  const token_hash = String(form.get("token_hash") || "");
  const type = String(form.get("type") || "");
  if (!["invite", "recovery"].includes(type) || !/^[a-zA-Z0-9_-]{20,512}$/.test(token_hash)) return { error: "El enlace no es válido. Solicitá uno nuevo." };
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ token_hash, type });
  if (error) return { error: error.code === "otp_expired"
    ? "El enlace venció o ya fue utilizado. Solicitá uno nuevo."
    : "No pudimos validar el enlace en este momento. Intentá nuevamente más tarde." };
  redirect("/auth/password");
}
export async function setPassword(_previous, form) {
  if (!isAuthConfigured()) return { error: "El acceso todavía no está habilitado." };
  let password;
  try { password = validatePassword(String(form.get("password") || ""), form.get("confirmation")); }
  catch (error) { return { error: error.message }; }
  const { supabase } = await requireActor({ allowSetup: true });
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "No pudimos cambiar la contraseña. Verificá los requisitos e intentá nuevamente." };
  const { error: onboardingError } = await supabase.rpc("complete_staff_onboarding");
  if (onboardingError) return { error: "La contraseña cambió, pero falta habilitar tu acceso. Intentá ingresar nuevamente o consultá a un administrador." };
  redirect("/admin");
}
