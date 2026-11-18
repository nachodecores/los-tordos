// Configuracion exclusiva de la web publica. No consulta ni modifica el sistema privado.
export const publicSite = {
  product: {
    name: "El Provo LT",
    approximateWeightGrams: null,
    packagePriceUyu: null,
    conservation: null,
    packagedPhoto: null,
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
export const inspirations = [
  { id: "hamburguesas", label: "Hamburguesas", image: "/images/image3.jpg", alt: "Hamburguesa con queso fundido y brasas al fondo", position: "58% 50%", mobilePosition: "72% 50%" },
  { id: "pastas", label: "Pastas", image: null },
  { id: "scones", label: "Scones", image: "/images/image9.jpg", alt: "Scones de queso junto a un mate sobre una mesa de madera", position: "66% 50%" },
  { id: "rellenos", label: "Rellenos", image: "/images/image8.jpg", alt: "Porcion de tarta con su relleno de queso a la vista", position: "52% 50%" },
  { id: "ensaladas", label: "Ensaladas", image: "/images/image2.jpg", alt: "Ensalada de hojas y tomates con trozos de queso", position: "55% 50%" },
  { id: "picadas", label: "Picadas", image: "/images/image7.jpg", alt: "Tabla de queso con fiambres, pan y aceitunas", position: "50% 50%" },
];
export function whatsappHref(number, message = publicSite.whatsappMessage) {
  if (typeof number !== "string") return null;
  const normalized = number.replace(/[\s()+-]/g, "");
  if (!/^[1-9][0-9]{7,14}$/.test(normalized)) return null;
  return "https://wa.me/" + normalized + "?text=" + encodeURIComponent(message);
}
