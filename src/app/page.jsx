import localFont from "next/font/local";
import PublicExperience from "@/components/public/PublicExperience";
import "./public-site.css";

const display = localFont({
  src: "./Knockout-HTF28-JuniorFeatherwt.otf",
  variable: "--public-display-font",
  display: "swap",
});

export const metadata = {
  title: "Los Tordos · Tenés queso",
  description: "Inspirate con Los Tordos. Conocé El Provo LT y encontrá nuevas formas de disfrutar el provolone.",
};

export default function Home() {
  return <PublicExperience fontClass={display.variable} />;
}
