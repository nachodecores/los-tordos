import Image from "next/image";
import {publicSite,whatsappHref} from "@/lib/public-site/config.mjs";
import Arrow from "./Arrow";
export default function BuyPanel(){
 const href=whatsappHref(publicSite.whatsappNumber);
 const content=<><span className="public-buy-brand"><Image src="/logos/logochicoamarillo.svg" alt="" width={910} height={720}/></span><span className="public-buy-copy"><span className="public-buy-kicker">{href?"Hablemos":"Próximamente"}</span><span>Comprá por<br/><strong>WhatsApp</strong></span></span><span className="public-buy-symbol">{publicSite.whatsappLogo?<Image src={publicSite.whatsappLogo} alt="" width={40} height={40}/>:<Arrow/>}</span></>;
 return <section id="compra" className="public-panel public-buy" aria-label="Comprá por WhatsApp">
  {href?<a className="public-buy-button" href={href} target="_blank" rel="noopener noreferrer" aria-label="Comprar El Provo LT por WhatsApp, abre una nueva pestaña">{content}</a>:<button className="public-buy-button" type="button" disabled aria-label="Compra por WhatsApp próximamente disponible">{content}</button>}
 </section>;
}
