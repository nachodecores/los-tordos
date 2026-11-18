"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/auth/access";
import { uuid, text, phone, productData, positiveInteger } from "@/lib/commercial/validation.mjs";
import { coordinate } from "@/lib/geo/geometry.mjs";
import { saveError } from "@/lib/commercial/errors.mjs";

export async function saveProduct(_previous, form) {
  const { supabase } = await requireActor({ permission: "catalog.manage" });
  let args;
  try { args = { p_id: uuid(form.get("id")), p_version: positiveInteger(form.get("version")), p_data: productData(form) }; }
  catch (error) { return { error: error.message }; }
  const { error } = await supabase.rpc("save_commercial_product", args);
  if (error) return { error: saveError(error) };
  revalidatePath("/admin/products");
  redirect("/admin/products?saved=1");
}
export async function saveCustomer(_previous, form) {
  const { supabase } = await requireActor({ permission: "customers.manage" });
  let args;
  try { args = { p_id: uuid(form.get("id")), p_version: positiveInteger(form.get("version")), p_address_version: positiveInteger(form.get("address_version")), p_data: { latitude: coordinate(form.get("latitude"), -85, 85), longitude: coordinate(form.get("longitude"), -180, 180), address_text: text(form.get("address_text"), "la dirección", 500, false), notes: text(form.get("notes"), "las observaciones", 1000, false), name: text(form.get("name"), "el nombre", 160), phone: phone(form.get("phone")) } }; }
  catch (error) { return { error: error.message }; }
  const { data: id, error } = await supabase.rpc("save_commercial_customer_form", args);
  if (error) return { error: saveError(error) };
  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${id}`);
  redirect(`/admin/customers/${id}?saved=1`);
}
