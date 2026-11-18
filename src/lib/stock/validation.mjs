import {uuid,positiveInteger,text} from "../commercial/validation.mjs";
export function stockData(form){
 const kind=String(form.get("kind")||"");
 if(!["entry","correction"].includes(kind))throw new Error("Elegí entrada o corrección.");
 const raw=String(form.get("quantity")??"").trim();
 if(!/^[0-9]+$/.test(raw)||Number(raw)>2147483647||(kind==="entry"&&Number(raw)<1))throw new Error("Ingresá una cantidad entera válida de paquetes.");
 return {p_key:uuid(form.get("request_key"),true),p_courier_id:uuid(form.get("courier_id"),true),
 p_product_id:uuid(form.get("product_id"),true),p_kind:kind,p_quantity:Number(raw),
 p_version:positiveInteger(form.get("version")),p_reason:text(form.get("reason"),"el motivo",1000,kind==="correction")};
}
