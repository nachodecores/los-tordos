"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import logochicoamarillo from "../../public/logos/logochicoamarillo.svg";

export default function AdminHeader() {
  const { data: session, status } = useSession();
  const usuario = session?.user;

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
        {status === "loading" && (
          <span className="text-sm text-gray-500">...</span>
        )}
        {usuario && (
          <>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-colorpurple4 flex items-center justify-center text-white text-sm font-medium"
                title={usuario.nombre || usuario.name}
              >
                {(usuario.nombre || usuario.name)?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {usuario.nombre || usuario.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
}
