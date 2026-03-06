"use client";

import { useSession } from "next-auth/react";
import AnimalBuscador from "@/components/AnimalBuscador";

export default function AdminPage() {
  const { data: session } = useSession();
  const isOperador = session?.user?.rol === "operador";

  return (
    <div>
      {isOperador ? (
        <AnimalBuscador />
      ) : (
        <AnimalBuscador listarTodos />
      )}
    </div>
  );
}
