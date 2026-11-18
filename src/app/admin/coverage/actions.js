"use server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireActor} from "@/lib/auth/access";
import {positiveInteger} from "@/lib/commercial/validation.mjs";
import {saveError} from "@/lib/commercial/errors.mjs";
import {validateBoundary} from "@/lib/geo/geometry.mjs";
export async function saveCoverage(_previous,form){
 const {supabase}=await requireActor({permission:"customers.manage"});
 let args;
 try {
  args={p_version:positiveInteger(form.get("version")),p_boundary:validateBoundary(JSON.parse(String(form.get("boundary")||"null"))),p_active:form.get("active")==="on"};
 }catch(error){return {error:error instanceof SyntaxError?"Revisá el perímetro de la zona.":error.message};}
 const {error}=await supabase.rpc("save_commercial_coverage",args);
 if(error)return {error:saveError(error)};
 revalidatePath("/admin/coverage");
 revalidatePath("/admin/customers","layout");
 redirect("/admin/coverage?saved=1");
}
