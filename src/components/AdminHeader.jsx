"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logochicoamarillo from "../../public/logos/logochicoamarillo.svg";

export default function AdminHeader() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUsuario(d.usuario));
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <Link href="/admin" className="flex items-center">
        <Image
          src={logochicoamarillo}
          alt="Los Tordos"
          width={40}
          height={40}
          className="object-contain"
        />
      </Link>
      <div className="flex items-center gap-3">
        {usuario && (
          <>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-colorpurple4 flex items-center justify-center text-white text-sm font-medium"
                title={usuario.nombre}
              >
                {usuario.nombre?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {usuario.nombre}
              </span>
            </div>
            <Link
              href="/api/auth/logout"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Cerrar sesión
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
