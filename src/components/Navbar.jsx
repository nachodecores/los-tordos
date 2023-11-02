"use client";
import Link from "next/link";
import Image from "next/image";
import logoletras from "../../public/logos/logoletrasamarillo.jpg";

export default function Navbar() {
  return (
    <nav className="flex justify-center h-20 items-center bg-colorpurple1">
      <Link href="/">
        <Image
          src={logoletras}
          alt="Logo Los Tordos Letras"
          width={100}
          height={100}
        />
      </Link>
    </nav>
  );
}
