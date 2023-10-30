import "./globals.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
// import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const knockout = localFont({
  src: "./Knockout-HTF28-JuniorFeatherwt.otf",
  display: "swap",
});

export const metadata = {
  title: "Los Tordos",
  description: "Los Tordos. Tenés queso.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${knockout.className} bg-coloryellow w-screen`}
      >
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
