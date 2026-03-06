"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "⌂" },
  { href: "/admin/animales", label: "Animales", icon: "🐄" },
  { href: "/admin/periodos-toro", label: "Períodos toro", icon: "🐂" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const usuario = session?.user;

  const isAdmin = usuario?.rol === "admin";
  const navItems = isAdmin
    ? NAV_ITEMS
    : NAV_ITEMS.filter((i) => i.href !== "/admin/periodos-toro");

  if (usuario && usuario.rol === "operador") {
    return null;
  }

  return (
    <>
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 md:border-r md:border-gray-200 bg-white">
        <div className="flex flex-col flex-1 pt-6 pb-4 overflow-y-auto">
          <div className="flex items-center px-4 mb-6">
            <span className="text-lg font-bold text-gray-800">Tambo Admin</span>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="px-3 mt-4 pt-4 border-t border-gray-200">
            {usuario && (
              <p className="px-3 py-2 text-xs text-gray-500 truncate">
                {usuario.nombre}
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Bottom nav - mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)] z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 ${
                  active ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
