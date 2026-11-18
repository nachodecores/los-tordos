"use client";
import {useRef,useState} from "react";
import Image from "next/image";
import {inspirations} from "@/lib/public-site/config.mjs";
import Arrow from "./Arrow";
const photos=inspirations.filter(item=>item.image);
export default function InspirationGallery(){
 const track=useRef(null),[active,setActive]=useState(0);
 function move(index){
  const next=Math.max(0,Math.min(photos.length-1,index));
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  track.current?.scrollTo({left:next*track.current.clientWidth,behavior:reduced?"instant":"smooth"});
 }
 function keys(event){
  const positions={ArrowRight:active+1,ArrowLeft:active-1,Home:0,End:photos.length-1};
  if(Object.hasOwn(positions,event.key)){event.preventDefault();event.stopPropagation();move(positions[event.key]);}
 }
 return <section id="inspirate" className="public-panel public-inspiration" aria-labelledby="inspiration-title">
  <div className="public-gallery" data-public-gallery ref={track} tabIndex={0} aria-roledescription="carrusel" aria-label="Formas de disfrutar el queso. Usá las flechas para recorrer las fotos." onKeyDown={keys} onScroll={()=>{const el=track.current;if(el)setActive(Math.round(el.scrollLeft/el.clientWidth));}}>
   {photos.map((photo,index)=><figure className="public-gallery-slide" key={photo.id} role="group" aria-roledescription="diapositiva" aria-label={(index+1)+" de "+photos.length+": "+photo.label}>
    <div className="public-photo-frame public-food-frame">
     <Image src={photo.image} alt={photo.alt} fill sizes="100vw" className="public-food-photo" style={{"--food-position":photo.position,"--food-mobile-position":photo.mobilePosition||photo.position}}/>
    </div>
    <figcaption><span className="public-photo-index">{"0"+(index+1)} / {"0"+photos.length}</span><span className="public-food-name">{photo.label}</span></figcaption>
   </figure>)}
  </div>
  <div className="public-inspiration-heading"><p className="public-eyebrow">02 — A tu manera</p><h2 id="inspiration-title">Inspirate<span>.</span></h2></div>
  <div className="public-gallery-bottom">
   <div className="public-categories" aria-label="Elegir preparación">{inspirations.map(item=>{
    const index=photos.findIndex(photo=>photo.id===item.id);
    return <button key={item.id} type="button" disabled={index<0} aria-pressed={index===active} onClick={()=>move(index)} title={index<0?"Fotografía próximamente":undefined}>{item.label}{index<0&&<span className="public-category-soon">Próximamente</span>}</button>;
   })}</div>
   <div className="public-gallery-arrows">
    <button type="button" className="public-arrow-button" aria-label="Preparación anterior" disabled={active===0} onClick={()=>move(active-1)}><Arrow direction="left"/></button>
    <button type="button" className="public-arrow-button" aria-label="Preparación siguiente" disabled={active===photos.length-1} onClick={()=>move(active+1)}><Arrow/></button>
   </div>
  </div>
  <span className="public-sr-only" aria-live="polite">{photos[active]?.label}</span>
 </section>;
}
