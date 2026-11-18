"use client";

import {useEffect,useRef,useState} from "react";
import {publicSite,whatsappHref} from "@/lib/public-site/config.mjs";
export default function BuyPanel(){
 const section=useRef(null);
 const [atEnd,setAtEnd]=useState(false);
 useEffect(()=>{
  const panel=section.current;
  const viewport=panel.closest('.public-viewport');
  let frame=0;
  function measure(){
   const maximum=viewport.scrollHeight-viewport.clientHeight;
   const position=viewport.scrollTop;
   setAtEnd(maximum>0 && maximum-position<=2);
  }
  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);}
  const observer=new ResizeObserver(schedule);
  observer.observe(viewport);
  observer.observe(panel);
  viewport.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  schedule();
  return ()=>{
   cancelAnimationFrame(frame);observer.disconnect();
   viewport.removeEventListener('scroll',schedule);
   window.removeEventListener('resize',schedule);
  };
 },[]);
 const href=whatsappHref(publicSite.whatsappNumber);
 const content=<span className="public-buy-mark" aria-hidden="true" style={{"--public-whatsapp-mark":'url("'+publicSite.whatsappLogo+'")'}}/>;
 return <section ref={section} id="compra" className={"public-panel public-buy"+(atEnd?" is-inverted":"")} aria-label="Comprá por WhatsApp">
  {href?<a className="public-buy-button" href={href} target="_blank" rel="noopener noreferrer" aria-label="Comprar El Provo LT por WhatsApp, abre una nueva pestaña">{content}</a>:<button className="public-buy-button" type="button" disabled aria-label="Compra por WhatsApp próximamente disponible">{content}</button>}
  <p className="public-buy-claim">pedilo!</p>
 </section>;
}
