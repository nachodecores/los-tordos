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
      router.replace("/admin/animales");
    }
  }, [session, status, router]);

  if (status === "loading" || session?.user?.rol === "admin") {
    return <div className="p-4 text-gray-500">Cargando...</div>;
  }

  // Si es operador, muestra el buscador
  return (
    <div className="min-h-screen flex items-start justify-center pt-12 p-4">
      <div className="w-full max-w-xl">
        <AnimalBuscador />
      </div>
    </div>
  );
}
