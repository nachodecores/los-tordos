"use server";
import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/auth/access";
import { normalizeEmail, validateRoles } from "@/lib/auth/permissions.mjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { appUrl } from "@/lib/supabase/config";

async function deliver(supabase, invitation) {
  let error;
  if (invitation.auth_user_id) {
    const { data: profile, error: profileError } = await supabase.from("staff_profiles").select("active,onboarding_required").eq("id", invitation.auth_user_id).single();
    if (profileError || !profile.active || !profile.onboarding_required) return { error: "Esta cuenta ya fue activada o está deshabilitada. Usá recuperación de acceso si corresponde." };
    ({ error } = await supabase.auth.resetPasswordForEmail(invitation.email, { redirectTo: appUrl("/auth/confirm") }));
  } else {
    ({ error } = await createAdminClient().auth.admin.inviteUserByEmail(invitation.email, { redirectTo: appUrl("/auth/confirm") }));
  }
  const { error: auditError } = await supabase.rpc("record_invitation_delivery", { p_id: invitation.id, p_success: !error });
  revalidatePath("/admin/users");
  if (error) return { error: "No se pudo enviar el correo. La invitación quedó guardada para volver a intentar." };
  if (auditError) return { error: "El correo se envió, pero no pudimos registrar su estado. Revisá la lista antes de reintentar." };
  return { success: "Correo enviado. La persona elegirá su propia contraseña." };
}
export async function inviteUser(_previous, form) {
  const { supabase } = await requireActor({ permission: "users.manage" });
  let email, roles, name;
  try {
    email = normalizeEmail(form.get("email"));
    roles = validateRoles(form.getAll("roles"));
    name = String(form.get("name") || "").trim();
    if (!name || name.length > 100) throw new Error("Ingresá un nombre de hasta 100 caracteres.");
    // Verifica la clave privada antes de reservar la invitación.
    createAdminClient();
  } catch (error) { return { error: error.message }; }
  const { data: id, error } = await supabase.rpc("reserve_staff_invitation", { p_email: email, p_name: name, p_roles: roles });
  if (error) return { error: "No pudimos crear la invitación. Revisá si ese correo ya figura en la lista." };
  try { return await deliver(supabase, { id, email }); }
  catch { revalidatePath("/admin/users"); return { error: "La invitación quedó guardada, pero el envío no pudo completarse. Podés reintentar desde la lista." }; }
}
export async function resendInvitation(_previous, form) {
  const { supabase } = await requireActor({ permission: "users.manage" });
  const { data: invitation, error } = await supabase.from("staff_invitations").select("id,email,auth_user_id").eq("id", String(form.get("id"))).single();
  if (error || !invitation) return { error: "No encontramos la invitación." };
  try { return await deliver(supabase, invitation); }
  catch { return { error: "No se pudo enviar el correo. Intentá nuevamente más tarde." }; }
}
export async function updateAccess(_previous, form) {
  const { supabase } = await requireActor({ permission: "users.manage" });
  let roles;
  try { roles = validateRoles(form.getAll("roles")); } catch (error) { return { error: error.message }; }
  const name = String(form.get("name") || "").trim();
  if (!name || name.length > 100) return { error: "Ingresá un nombre de hasta 100 caracteres." };
  const { error } = await supabase.rpc("update_staff_access", {
    p_id: String(form.get("id")), p_name: name, p_roles: roles, p_active: form.get("active") === "on",
  });
  if (error) return { error: error.code === "23514" ? "Debe quedar al menos otro administrador activo con su acceso configurado." : "No pudimos modificar el acceso. Recargá la página e intentá nuevamente." };
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { success: "Acceso actualizado. Los permisos se verifican nuevamente en cada operación." };
}
