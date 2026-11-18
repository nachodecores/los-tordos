"use client";
import {useState} from "react";
import AuthForm from "@/components/auth/AuthForm";
import InteractiveMap from "./InteractiveMap";
import {saveCoverage} from "@/app/admin/coverage/actions";
import {coordinate,validateBoundary} from "@/lib/geo/geometry.mjs";
export default function CoverageForm({coverage}){
 const [points,setPoints]=useState(coverage?.boundary||[]),[drawing,setDrawing]=useState(false);
 const [lat,setLat]=useState(""),[lon,setLon]=useState(""),[error,setError]=useState("");
 function add(point){
  if(points.length>=100){setError("La zona admite hasta 100 puntos.");return;}
  setPoints(current=>[...current,point]);setError("");
 }
 function addCoordinates(){
  try {
   const x=coordinate(lon,-180,180),y=coordinate(lat,-85,85);
   if(x===null||y===null)throw new Error("Ingresá ambas coordenadas.");
   add([x,y]);setLat("");setLon("");
  }catch(error){setError(error.message);}
 }
 let valid=false;
 try{validateBoundary(points);valid=true;}catch{}
 return <AuthForm action={saveCoverage} submitLabel="Guardar cobertura" disabled={!valid}>
  <input name="version" type="hidden" value={coverage?.version||""} />
  <input name="boundary" type="hidden" value={JSON.stringify(points)} />
  <p>Marcá los vértices en orden alrededor de la zona. El último se une automáticamente con el primero.</p>
  <div className="geo-toolbar">
   <button type="button" className="geo-secondary" onClick={()=>setDrawing(!drawing)}>{drawing?"Terminar dibujo":"Marcar puntos"}</button>
   <button type="button" className="geo-secondary" disabled={!points.length} onClick={()=>setPoints(current=>current.slice(0,-1))}>Deshacer último punto</button>
   <button type="button" className="geo-secondary" disabled={!points.length} onClick={()=>{setPoints([]);setDrawing(true);}}>Dibujar de nuevo</button>
  </div>
  <InteractiveMap polygon boundary={points} selecting={drawing} onSelect={add} />
  <p role="status">{points.length} puntos · {drawing?"Tocá el mapa para agregar puntos.":"Dibujo detenido."} {!valid&&"Definí un perímetro de al menos 3 puntos, sin cruces ni puntos repetidos."}</p>
  <details><summary>Agregar punto por coordenadas</summary>
   <div className="commerce-form-row"><label>Latitud<input type="number" min="-85" max="85" step="0.000001" value={lat} onChange={e=>setLat(e.target.value)} /></label><label>Longitud<input type="number" min="-180" max="180" step="0.000001" value={lon} onChange={e=>setLon(e.target.value)} /></label></div>
   <button className="geo-secondary" type="button" onClick={addCoordinates}>Agregar punto</button>
  </details>
  {error&&<p role="alert">{error}</p>}
  <label className="access-checkbox"><input type="checkbox" name="active" defaultChecked={coverage?.active||false} />Cobertura habilitada</label>
  <p className="panel-muted">Los cambios se aplican al guardar. Deshabilitar la zona deja la cobertura sin definir; no cancela ni modifica pedidos.</p>
 </AuthForm>;
}
