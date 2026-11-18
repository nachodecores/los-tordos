"use client";
import {useState} from "react";
import AuthForm from "@/components/auth/AuthForm";
import {recordStock} from "@/app/admin/stock/actions";
export default function StockMovementForm({couriers,products,accounts,requestKey}){
 const [key]=useState(requestKey),[courier,setCourier]=useState(""),[product,setProduct]=useState(""),[kind,setKind]=useState("entry");
 const account=accounts.find(a=>a.courier_id===courier&&a.product_id===product);
 const recipient=couriers.find(c=>c.id===courier);
 const eligible=recipient?.active&&recipient?.roles?.includes("reparto");
 const permitted=eligible||(kind==="correction"&&Boolean(account));
 return <AuthForm action={recordStock} submitLabel="Registrar movimiento" disabled={!courier||!product||!permitted}>
  <input type="hidden" name="request_key" value={key}/><input type="hidden" name="version" value={account?.version||""}/>
  <label>Repartidor<select name="courier_id" value={courier} onChange={e=>setCourier(e.target.value)} required><option value="">Seleccionar repartidor</option>
   {couriers.map(c=><option key={c.id} value={c.id}>{c.name}{c.active&&c.roles?.includes("reparto")?"":" · Cuenta histórica"}</option>)}</select></label>
  <label>Producto<select name="product_id" value={product} onChange={e=>setProduct(e.target.value)} required><option value="">Seleccionar producto</option>
   {products.map(p=><option key={p.id} value={p.id}>{p.name} · {p.sku}</option>)}</select></label>
  {courier&&product&&<p role="status">Saldo registrado actual: <strong>{account?.balance??0} paquetes</strong>.</p>}
  <label>Movimiento<select name="kind" value={kind} onChange={e=>setKind(e.target.value)}><option value="entry">Entrada de stock</option><option value="correction">Corrección de saldo</option></select></label>
  <label>{kind==="entry"?"Paquetes que se agregan":"Saldo real de paquetes"}<input name="quantity" type="number" step="1" min={kind==="entry"?"1":"0"} max="2147483647" required key={kind}/></label>
  <label>Motivo {kind==="correction"?"(obligatorio)":"(opcional)"}<textarea name="reason" maxLength={1000} required={kind==="correction"} rows={3}/></label>
  {kind==="correction"&&<p className="panel-muted">Se registra la diferencia entre el saldo actual y el saldo real indicado. Los movimientos anteriores se conservan.</p>}
  {courier&&!eligible&&<p className="panel-muted">Esta cuenta solo admite correcciones de productos con saldo registrado. Las entradas requieren un repartidor activo.</p>}
 </AuthForm>;
}
