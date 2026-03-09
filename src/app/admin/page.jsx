"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AnimalBuscador from "@/components/AnimalBuscador";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.rol === "admin") {
      router.replace("/admin/informes");
    }
  }, [session, status, router]);

  if (status === "loading" || session?.user?.rol === "admin") {
    return <div className="p-4 text-gray-500">Cargando...</div>;
  }

  // Si es operador, muestra el buscador
  return (
    <div className="max-w-xl mx-auto mt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buscar Animal</h1>
        <p className="text-gray-600 text-sm mt-1">
          Busque una caravana para registrar un evento.
        </p>
      </div>
      <AnimalBuscador />
    </div>
  );
}
