import Image from "next/image";
import {sections} from "@/lib/public-site/config.mjs";

export function PublicHeader({active,onNavigate}) {
  return <header className="public-header" hidden={active===0}>
    <a className="public-brand" href="#inicio" aria-label="Los Tordos, volver al inicio" onClick={event=>{event.preventDefault();onNavigate(0);}}>
      <Image src="/logos/logoletrasamarillo.jpg" alt="Los Tordos" width={993} height={323} sizes="120px"/>
    </a>
    <nav aria-label="Secciones de Los Tordos" className="public-nav">
      {sections.map((section,index)=><a key={section.id} href={"#"+section.id} aria-current={active===index?"location":undefined} onClick={event=>{event.preventDefault();onNavigate(index);}}>
        <span className="public-nav-number">{section.number}</span>{section.label}
      </a>)}
    </nav>
  </header>;
}
