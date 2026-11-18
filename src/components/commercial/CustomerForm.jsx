"use client";
import { useState } from "react";
import CustomerLocation from "@/components/geo/CustomerLocation";
import AuthForm from "@/components/auth/AuthForm";
import { saveCustomer } from "@/app/admin/commercial-actions";

export function CustomerForm({ customer, address, coverage }) {
  const [addressText,setAddressText]=useState(address?.address_text||"");
  const [point,setPoint]=useState(address?.latitude!=null && address?.location_verified_at ? [Number(address.longitude),Number(address.latitude)] : null);
  return <AuthForm action={saveCustomer} submitLabel={customer ? "Guardar cliente" : "Crear cliente"}>
    <input name="id" type="hidden" value={customer?.id||""} /><input name="version" type="hidden" value={customer?.version||""} />
    <input name="latitude" type="hidden" value={point?.[1]??""} /><input name="longitude" type="hidden" value={point?.[0]??""} />
    <input name="address_version" type="hidden" value={address?.version || ""} />
    <label>Nombre<input name="name" defaultValue={customer?.name || ""} required maxLength={160} autoComplete="name" /></label>
    <label>Teléfono con código de país<input name="phone" type="tel" defaultValue={customer?.phone || ""} required maxLength={30} placeholder="+598…" autoComplete="tel" /></label>
    <label>Dirección de entrega<textarea name="address_text" value={addressText} onChange={event=>{setAddressText(event.target.value);setPoint(null);}} required={Boolean(address)} maxLength={500} rows={3} autoComplete="street-address" /></label>
    <label>Observaciones<textarea name="notes" defaultValue={address?.notes || ""} maxLength={1000} rows={2} placeholder="Apartamento, portería u otras indicaciones" /></label>
    <CustomerLocation point={point} onChange={setPoint} coverage={coverage} disabled={!addressText.trim()} />
    <p className="panel-muted">Una sola dirección editable por cliente. Podés dejarla pendiente al crear la ficha. Guardarla no verifica todavía la ubicación ni la cobertura.</p>
    <p className="panel-muted">La carga es manual desde administración. No se crea una cuenta ni se envía ningún mensaje.</p>
  </AuthForm>;
}
