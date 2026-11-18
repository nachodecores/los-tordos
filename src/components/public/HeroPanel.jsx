import Image from "next/image";
export default function HeroPanel(){
 return <section id="inicio" className="public-panel public-hero" aria-label="Inicio">
  <h1 className="public-sr-only">Los Tordos. Tenés queso.</h1>
  <div className="public-photo-frame public-hero-frame">
   <Image src="/images/image1.jpg" alt="Provolone dorado con queso fundido sobre una tabla oscura" fill sizes="100vw" preload className="public-hero-photo"/>
  </div>
 </section>;
}
