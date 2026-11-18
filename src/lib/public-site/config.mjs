import heroAdjustments from './hero-adjustments.json';
import {cleanAdjustments} from './hero-editing.mjs';
// Configuracion exclusiva de la web publica. No consulta ni modifica el sistema privado.
export const publicSite = {
  product: {
    name: "El Provo LT",
    approximateWeightGrams: 440,
    packagePriceUyu: 395,
    conservation: null,
    packagedPhoto: "/images/provo-lt-placeholder.png",
  },
  // Completar solamente con el numero empresarial confirmado, con codigo de pais.
  whatsappNumber: null,
  whatsappMessage: "Hola, quiero comprar El Provo LT.",
  // Recurso original del centro de marca de Meta, sin modificaciones.
  whatsappLogo: "/logos/whatsapp-official.svg",
};
export const sections = [
  { id: "inicio", label: "Inicio", number: "01" },
  { id: "inspirate", label: "Inspirate", number: "02" },
  { id: "el-provo-lt", label: "El Provo LT", number: "03" },
  { id: "compra", label: "Comprá", number: "04" },
];
// Inicio: tomas reales del provo, con encuadres y exposicion por foto.
const originalHeroPhotos = [
  { id: "provo-plancha", image: "/images/image1.jpg", alt: "Provolone dorado con queso fundido sobre una tabla oscura", position: "50% 56%", mobilePosition: "53% 53%", brightness: 0.83 },
  { id: "provo-oregano", image: "/images/provo/plancha-oregano.jpg", alt: "Provolone a la plancha con orégano y queso fundido", position: "50% 53%", mobilePosition: "58% 50%", brightness: 0.78 },
  { id: "provo-tabla", image: "/images/provo/plancha-tabla.jpg", alt: "Provolone dorado sobre una tabla con pan, tomates y especias", position: "50% 68%", mobilePosition: "65% 60%", brightness: 0.72 },
  { id: "provo-entero", image: "/images/provo/plancha-entero.jpg", alt: "Provolone a la plancha en primer plano sobre una tabla de madera", position: "50% 80%", mobilePosition: "62% 64%", brightness: 0.75 },
  { id: "provo-vertical", image: "/images/provo/plancha-vertical.jpg", alt: "Provolone a la plancha con queso fundido al levantarlo con una espatula", position: "50% 52%", mobilePosition: "50% 50%", brightness: 0.83 },
];
const savedHeroAdjustments = cleanAdjustments(heroAdjustments, originalHeroPhotos);
export const heroPhotos = originalHeroPhotos.map(photo => ({...photo,...savedHeroAdjustments[photo.id]}));
export const heroSlideshow = { intervalMs: 5200, crossfadeMs: 1000 };
export const inspirations = [
  { id: "hamburguesas", label: "Hamburguesas", image: "/images/image3.jpg", alt: "Hamburguesa con queso fundido y brasas al fondo", position: "58% 50%", mobilePosition: "72% 50%" },
  { id: "pastas", label: "Pastas", image: null },
  { id: "scones", label: "Scones", image: "/images/image9.jpg", alt: "Scones de queso junto a un mate sobre una mesa de madera", position: "66% 50%" },
  { id: "rellenos", label: "Rellenos", image: "/images/image8.jpg", alt: "Porcion de tarta con su relleno de queso a la vista", position: "52% 50%" },
  { id: "ensaladas", label: "Ensaladas", image: "/images/image2.jpg", alt: "Ensalada de hojas y tomates con trozos de queso", position: "55% 50%" },
  { id: "picadas", label: "Picadas", image: "/images/image7.jpg", alt: "Tabla de queso con fiambres, pan y aceitunas", position: "50% 50%" },
  { id: "pizza", label: "Pizza", image: "/images/image5.jpg", alt: "Pizza con queso fundido sobre una tabla de madera", position: "52% 55%" },
  { id: "martin-fierro", label: "Martín Fierro", image: "/images/image6.jpg", alt: "Postre Martín Fierro con queso y dulce de membrillo", position: "55% 50%" },
  { id: "tostada", label: "Tostada", image: "/images/image4.jpg", alt: "Tostada con queso junto a una taza de café", position: "65% 50%", mobilePosition: "70% 50%" },
];
export function whatsappHref(number, message = publicSite.whatsappMessage) {
  if (typeof number !== "string") return null;
  const normalized = number.replace(/[\s()+-]/g, "");
  if (!/^[1-9][0-9]{7,14}$/.test(normalized)) return null;
  return "https://wa.me/" + normalized + "?text=" + encodeURIComponent(message);
}
