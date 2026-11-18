"use server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireActor} from "@/lib/auth/access";
import {stockData} from "@/lib/stock/validation.mjs";
import {saveError} from "@/lib/commercial/errors.mjs";
export async function recordStock(_previous,form){
 const {supabase}=await requireActor({permission:"stock.manage"});
 let args;
 try{args=stockData(form);}catch(error){return {error:error.message};}
 const {error}=await supabase.rpc("record_commercial_stock",args);
 if(error){
  const known={"Balance unchanged":"El saldo indicado es igual al actual. No hay una corrección para registrar.",
   "Active courier required":"Las entradas requieren un repartidor activo con permiso de reparto.",
   "Request key already used":"Esta operación ya fue utilizada. Recargá la página para registrar otro movimiento."};
  return {error:known[error.message]||saveError(error)};
 }
 revalidatePath("/admin/stock");
 redirect("/admin/stock?saved=1");
}
