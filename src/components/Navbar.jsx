"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoletras from "../../public/logos/logoletrasamarillo.jpg";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-center h-20 items-center transition-all duration-300 ${
      isScrolled ? 'bg-colorpurple4' : 'bg-transparent'
    }`}>
      <Link href="/" className={`transition-opacity duration-300 ${
        isScrolled ? 'opacity-0' : 'opacity-100'
      }`}>
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
