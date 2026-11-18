import {publicSite,whatsappHref} from "@/lib/public-site/config.mjs";
export default function BuyPanel(){
 const href=whatsappHref(publicSite.whatsappNumber);
 const content=<span className="public-buy-mark" aria-hidden="true" style={{"--public-whatsapp-mark":'url("'+publicSite.whatsappLogo+'")'}}/>;
 return <section id="compra" className="public-panel public-buy" aria-label="Comprá por WhatsApp">
  {href?<a className="public-buy-button" href={href} target="_blank" rel="noopener noreferrer" aria-label="Comprar El Provo LT por WhatsApp, abre una nueva pestaña">{content}</a>:<button className="public-buy-button" type="button" disabled aria-label="Compra por WhatsApp próximamente disponible">{content}</button>}
 </section>;
}
