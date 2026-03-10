"use client";

import { useSession } from "next-auth/react";
import AnimalBuscador from "@/components/AnimalBuscador";
import AnimalesListaAdmin from "@/components/admin/AnimalesListaAdmin";

export default function AnimalesPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-4 text-center text-gray-500">Cargando...</div>;
  }

  const isAdmin = session?.user?.rol === "admin";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Animales</h1>
        <p className="text-gray-600 text-sm mt-1">
          {isAdmin ? "Directorio completo del rodeo." : "Busque un animal para registrar eventos."}
        </p>
      </div>

      {isAdmin ? (
        <AnimalesListaAdmin />
      ) : (
        <AnimalBuscador showVolver={false} hideTitle />
      )}
    </div>
  );
}
