import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAuthConfigured } from "@/lib/supabase/config";
import { hasPermission } from "./permissions.mjs";

export async function requireActor({ permission, allowSetup = false } = {}) {
  if (!isAuthConfigured()) redirect("/auth/login");
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/auth/login");
  const { data: validSession, error: sessionError } = await supabase.rpc("staff_session_is_valid");
  if (sessionError || !validSession) redirect("/auth/denied");
  const { data: profile, error: profileError } = await supabase.from("staff_profiles").select("*").eq("id", user.id).maybeSingle();
  if (profileError || !profile || !profile.active) redirect("/auth/denied");
  if (!allowSetup && profile.onboarding_required) redirect("/auth/password");
  if (permission && !hasPermission(profile.roles, permission)) redirect("/auth/denied");
  return { supabase, user, profile };
}
