"use client";
import Link from "next/link";
import Image from "next/image";
import logochico from "../../public/logochico.png";

export default function Footer() {
  return (
    <nav className="flex justify-center px-10 py-6">
      <Link href="/">
        <Image
          src={logochico}
          alt="Logo Los Tordos Letras"
          width={40}
          height={40}
        />
      </Link>
    </nav>
  );
}
