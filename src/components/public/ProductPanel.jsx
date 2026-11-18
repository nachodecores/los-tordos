import Image from "next/image";
import {publicSite} from "@/lib/public-site/config.mjs";
export default function ProductPanel(){
 const product=publicSite.product;
 const price=product.packagePriceUyu===null?"A confirmar":new Intl.NumberFormat("es-UY",{style:"currency",currency:"UYU",minimumFractionDigits:0,maximumFractionDigits:2}).format(product.packagePriceUyu);
 const weight=product.approximateWeightGrams===null?"En desarrollo":product.approximateWeightGrams+" g";
 return <section id="el-provo-lt" className={"public-panel public-product"+(product.packagedPhoto?" has-product-photo":"")} aria-labelledby="product-title" data-public-vertical-scroll>
  <div className="public-product-art">
   <p className="public-eyebrow">03 — Provolone Los Tordos</p>
   <h2 id="product-title"><span>El</span>{" "}<span>Provo</span>{" "}<span>LT.</span></h2>
   {product.packagedPhoto?<figure className="public-package-figure">
    <div className="public-package-image"><Image src={product.packagedPhoto} alt="Imagen provisoria del envase de El Provo LT" fill sizes="(min-width:1024px) 47vw, 88vw" className="public-packaged-photo"/></div>
    <figcaption>Imagen ilustrativa · Presentación en desarrollo</figcaption>
   </figure>:<Image src="/logos/logochicoamarillo.svg" alt="" width={910} height={720} className="public-product-bird"/>}
  </div>
  <div className="public-product-copy">
   <div className="public-product-intro"><span className="public-small-rule"/><p>Provolone.<br/>Y todo lo que podés hacer con él.</p></div>
   <dl className="public-product-specs"><div><dt>{product.approximateWeightGrams===null?"Presentación":"Peso aproximado"}</dt><dd>{weight}</dd></div><div><dt>Precio por paquete</dt><dd>{price}</dd></div></dl>
   {product.conservation&&<p className="public-conservation">{product.conservation}</p>}
   <div className="public-delivery">
    <p className="public-eyebrow">Lo llevamos</p>
    <p className="public-delivery-place">Zonas seleccionadas<br/>de Montevideo.</p>
    <p className="public-delivery-days">Miércoles · Jueves · Viernes</p>
    <p className="public-delivery-note">Pedidos confirmados hasta el viernes a las 15:00: entrega esa misma semana. Después, en el siguiente ciclo semanal.</p>
   </div>
  </div>
 </section>;
}
