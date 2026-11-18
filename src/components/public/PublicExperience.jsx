"use client";
import {useCallback,useEffect,useRef} from "react";
import {sections} from "@/lib/public-site/config.mjs";
import HeroPanel from "./HeroPanel";
import InspirationGallery from "./InspirationGallery";
import ProductPanel from "./ProductPanel";
import BuyPanel from "./BuyPanel";

export default function PublicExperience({fontClass}){
 const viewport=useRef(null),current=useRef(0);
 const goTo=useCallback((index,updateHash=true,focusSection=false)=>{
  const root=viewport.current,section=root?.querySelector("#"+sections[index]?.id);
  if(!section)return;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.scrollTo({left:0,top:section.offsetTop,behavior:reduced?"instant":"smooth"});
  if(focusSection||(root.contains(document.activeElement)&&!section.contains(document.activeElement))){
   section.tabIndex=-1;
   section.focus({preventScroll:true});
  }
  if(updateHash)window.history.replaceState(null,"","#"+sections[index].id);
 },[]);
 useEffect(()=>{
  const root=viewport.current,shell=root.parentElement,desktop=window.matchMedia("(min-width: 1024px)");
  let frame=0,wheelSum=0,lastWheel=0,lastDirection=0,consumed=false,lockedUntil=0;
  const panels=Array.from(root.querySelectorAll(":scope > section"));
  function update(){
   frame=0;
   const bounds=root.getBoundingClientRect();
   let selected=0,largest=-1;
   panels.forEach((panel,index)=>{
    const rect=panel.getBoundingClientRect();
    const visible=Math.max(0,Math.min(rect.bottom,bounds.bottom)-Math.max(rect.top,bounds.top));
    if(visible>largest){selected=index;largest=visible;}
   });
   current.current=selected;
  }
  function scroll(){if(!frame)frame=requestAnimationFrame(update);}
  function canScrollInside(target,delta){
   const element=target instanceof Element?target.closest("[data-public-vertical-scroll]"):null;
   if(element&&!desktop.matches){
    const rect=element.getBoundingClientRect(),bounds=root.getBoundingClientRect();
    return delta>0?rect.bottom>bounds.bottom+2:rect.top<bounds.top-2;
   }
   return element && element.scrollHeight>element.clientHeight+2 && (delta>0?element.scrollTop+element.clientHeight<element.scrollHeight-2:element.scrollTop>2);
  }
  function wheel(event){
   if(!desktop.matches||event.ctrlKey||event.defaultPrevented)return;
   if(Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
   if(canScrollInside(event.target,event.deltaY))return;
   event.preventDefault();
   const now=performance.now(),direction=Math.sign(event.deltaY);
   // La inercia de la rueda puede llegar en varias rafagas del mismo gesto.
   // Solo habilitar otro salto tras una pausa y al terminar la transicion.
   if((now-lastWheel>400 && now>=lockedUntil)||direction!==lastDirection){wheelSum=0;consumed=false;}
   lastWheel=now;lastDirection=direction;
   if(consumed||now<lockedUntil)return;
   wheelSum+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?root.clientHeight:1);
   if(Math.abs(wheelSum)<28)return;
   const next=Math.max(0,Math.min(sections.length-1,current.current+Math.sign(wheelSum)));
   consumed=true;lockedUntil=now+1000;wheelSum=0;
   if(next!==current.current)goTo(next);
  }
  function keyboard(event){
   if(event.defaultPrevented||event.ctrlKey||event.altKey||event.metaKey)return;
   const element=event.target;
   if(element instanceof Element&&(element.closest("input,textarea,select,[contenteditable=true]")||element.closest("button,a")&&[" ","Enter"].includes(event.key)))return;
   if(["ArrowDown","ArrowUp","PageDown","PageUp"," "].includes(event.key)&&canScrollInside(element,event.key==="ArrowUp"||event.key==="PageUp"||event.shiftKey?-1:1))return;
   const nextKeys=["ArrowDown","PageDown"],previousKeys=["ArrowUp","PageUp"];
   let next=null;
   if(nextKeys.includes(event.key)||(event.key===" "&&!event.shiftKey))next=Math.min(3,current.current+1);
   if(previousKeys.includes(event.key)||(event.key===" "&&event.shiftKey))next=Math.max(0,current.current-1);
   if(event.key==="Home")next=0;
   if(event.key==="End")next=3;
   if(next!==null){event.preventDefault();goTo(next,true,true);}
  }
  function resize(){goTo(current.current,false);}
  function hash(){const index=sections.findIndex(section=>"#"+section.id===window.location.hash);if(index>=0)goTo(index,false);}
  root.addEventListener("scroll",scroll,{passive:true});
  shell.addEventListener("wheel",wheel,{passive:false});
  window.addEventListener("keydown",keyboard);
  window.addEventListener("hashchange",hash);
  desktop.addEventListener("change",resize);
  hash();update();
  return()=>{cancelAnimationFrame(frame);root.removeEventListener("scroll",scroll);shell.removeEventListener("wheel",wheel);window.removeEventListener("keydown",keyboard);window.removeEventListener("hashchange",hash);desktop.removeEventListener("change",resize);};
 },[goTo]);
 return <div className={"public-site "+fontClass} lang="es-UY">
  <a className="public-skip" href="#inspirate" onClick={event=>{event.preventDefault();goTo(1);viewport.current?.querySelector("[data-public-gallery]")?.focus({preventScroll:true});}}>Ir al contenido</a>
  <main ref={viewport} className="public-viewport" aria-label="Los Tordos: Inicio, Inspirate, El Provo LT y Comprá">
   <HeroPanel/><InspirationGallery/><ProductPanel/><BuyPanel/>
  </main>
 </div>;
}
