"use client";
import Link from "next/link";
import Image from "next/image";
import logoletras from "../../public/logoletras.jpg";

export default function Navbar() {
  <nav className="flex justify-center px-10 py-6">
    <Link href="/">
      <Image
        src={logoletras}
        alt="Logo Los Tordos Letras"
        width={120}
        height={120}
      />
    </Link>
  </nav>;
}
