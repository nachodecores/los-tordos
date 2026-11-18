"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function InteractiveMap({ boundary=[], point=null, onSelect, selecting=true, polygon=false }) {
  const host=useRef(null), latest=useRef(null), initial=useRef({boundary,point});
  const [instance,setInstance]=useState(null),[error,setError]=useState("");
  useEffect(()=>{latest.current={onSelect,selecting};},[onSelect,selecting]);
  useEffect(()=>{
    let disposed=false,map;
    import("leaflet").then(module=>{
      if(disposed) return;
      const L=module.default;
      map=L.map(host.current,{scrollWheelZoom:false,doubleClickZoom:false}).setView([-34.90,-56.16],12);
      const tiles=L.tileLayer(process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png",{
        maxZoom:19,referrerPolicy:"origin",
        attribution:process.env.NEXT_PUBLIC_MAP_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      tiles.on("tileerror",()=>setError("No se pudo cargar el mapa de fondo. Podés usar las coordenadas o intentar más tarde."));
      map.on("click",event=>{if(latest.current?.selecting) latest.current.onSelect?.([Number(event.latlng.lng.toFixed(6)),Number(event.latlng.lat.toFixed(6))]);});
      if(initial.current.point) map.setView([initial.current.point[1],initial.current.point[0]],16);
      else if(initial.current.boundary.length>=3) map.fitBounds(initial.current.boundary.map(p=>[p[1],p[0]]),{padding:[20,20]});
      setInstance({map,L});
    }).catch(()=>setError("No pudimos abrir el mapa. Podés usar las coordenadas."));
    return ()=>{disposed=true;map?.remove();};
  },[]);
  useEffect(()=>{
    if(!instance) return;
    const {map,L}=instance,layer=L.layerGroup().addTo(map);
    if(boundary.length>=3) L.polygon(boundary.map(p=>[p[1],p[0]]),{color:"#6c1e73",fillOpacity:0.12,interactive:false}).addTo(layer);
    else if(boundary.length) L.polyline(boundary.map(p=>[p[1],p[0]]),{color:"#6c1e73",interactive:false}).addTo(layer);
    if(polygon) boundary.forEach((p,i)=>L.circleMarker([p[1],p[0]],{radius:5,color:"#6c1e73",interactive:false}).bindTooltip(String(i+1)).addTo(layer));
    if(point) L.circleMarker([point[1],point[0]],{radius:9,color:"#1c5c34",fillOpacity:0.8,interactive:false}).addTo(layer);
    return ()=>layer.remove();
  },[instance,boundary,point,polygon]);
  function selectCenter(){
    if(!instance) return;
    const center=instance.map.getCenter();
    onSelect?.([Number(center.lng.toFixed(6)),Number(center.lat.toFixed(6))]);
  }
  return <div className="geo-map-wrap">
    <div ref={host} className="geo-map" role="region" aria-label={polygon?"Mapa de zona de cobertura":"Mapa de ubicación del cliente"} tabIndex={0} />
    {error&&<p role="alert">{error}</p>}
    {selecting&&<button className="geo-secondary" type="button" disabled={!instance} onClick={selectCenter}>{polygon?"Agregar el centro del mapa":"Marcar el centro del mapa"}</button>}
    <p className="panel-muted">Mové el mapa y usá + / − para acercar o alejar.</p>
  </div>;
}
