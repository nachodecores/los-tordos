"use client";
import InteractiveMap from "./InteractiveMap";
import { coordinate,coverageLabels,pointCoverage } from "@/lib/geo/geometry.mjs";
export default function CustomerLocation({ point,onChange,coverage,disabled=false }) {
  function update(axis,value){
    try {
      const next=coordinate(value,axis===0?-180:-85,axis===0?180:85);
      onChange(axis===0?[next,point?.[1]??null]:[point?.[0]??null,next]);
    } catch { /* La restriccion del campo impide guardar fuera de rango. */ }
  }
  const complete=point?.every(v=>v!==null&&Number.isFinite(v));
  const status=pointCoverage(complete?point:null,coverage?.boundary,coverage?.active);
  return <fieldset className="geo-fieldset" disabled={disabled}><legend>Ubicación de entrega</legend>
    <p>Marcá el punto en el mapa. Cambiar el texto de la dirección quita la ubicación anterior para que puedas revisarla.</p>
    <InteractiveMap point={complete?point:null} boundary={coverage?.boundary||[]} onSelect={onChange} selecting={!disabled} />
    <div className="commerce-form-row">
      <label>Latitud<input type="number" step="0.000001" min="-85" max="85" value={point?.[1]??""} onChange={e=>update(1,e.target.value)} /></label>
      <label>Longitud<input type="number" step="0.000001" min="-180" max="180" value={point?.[0]??""} onChange={e=>update(0,e.target.value)} /></label>
    </div>
    <button type="button" className="geo-secondary" onClick={()=>onChange(null)}>Quitar ubicación</button>
    <p role="status">{coverageLabels[status]}{!complete?" · Ubicación pendiente":""}</p>
    <p className="panel-muted">La ubicación se guarda junto con los demás datos del cliente.</p>
  </fieldset>;
}
