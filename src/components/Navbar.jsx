"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoletras from "../../public/logos/logoletrasamarillo.jpg";
import logochicoamarillo from "../../public/logos/logochicoamarillo.svg";

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
    <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-20 px-6 transition-all duration-300 ${
      isScrolled ? 'bg-colorpurple5/75 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      {/* Logo pequeño y menú que aparecen al hacer scroll */}
      <div className={`flex items-center gap-4 transition-opacity duration-300 ${
        isScrolled ? 'opacity-100' : 'opacity-0'
      }`}>
        <Link href="/">
          <Image
            src={logochicoamarillo}
            alt="Logo Los Tordos Pequeño"
            width={30}
            height={30}
            className="object-contain"
          />
        </Link>
        
        {/* Icono de menú */}
        <button className="text-coloryellow6 hover:text-coloryellow4 transition-colors duration-300">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path 
              d="M3 12H21M3 6H21M3 18H21" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Logo grande central */}
      <Link href="/" className={`transition-opacity duration-300 absolute left-1/2 transform -translate-x-1/2 ${
        isScrolled ? 'opacity-0' : 'opacity-100'
      }`}>
        <Image
          src={logoletras}
          alt="Logo Los Tordos Letras"
          width={100}
          height={100}
        />
      </Link>

      {/* Espaciador invisible para balancear el layout */}
      <div className="w-[50px]"></div>
    </nav>
  );
}
