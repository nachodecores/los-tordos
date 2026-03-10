"use client";

import { useSession, signOut } from "next-auth/react";

export default function AdminUserMenu({ compact = false, nameOnMobile = true, vertical = false, hideAvatar = false }) {
  const { data: session, status } = useSession();
  const usuario = session?.user;

  if (status === "loading") {
    return <span className="text-sm text-gray-500">...</span>;
  }
  if (!usuario) return null;

  const nombre = usuario.nombre || usuario.name;
  const inicial = nombre?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className={`flex gap-2 ${vertical ? "flex-col" : "flex-row items-center gap-3"}`}>
      <div className="flex items-center gap-2 min-w-0">
        {!hideAvatar && (
          <div
            className="w-8 h-8 rounded-full bg-colorpurple4 flex items-center justify-center text-white text-sm font-medium shrink-0"
            title={nombre}
          >
            {inicial}
          </div>
        )}
        {!compact && (
          <span className={`text-sm font-medium text-gray-700 truncate ${!nameOnMobile ? "hidden sm:inline" : ""}`}>
            {nombre}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="text-gray-500 hover:text-gray-700 text-sm shrink-0 text-left"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
