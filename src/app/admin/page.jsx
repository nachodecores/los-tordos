"use client";

import { useEffect, useState } from "react";
import AnimalBuscador from "@/components/AnimalBuscador";

export default function AdminPage() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUsuario(d.usuario));
  }, []);

  const isOperador = usuario?.rol === "operador";

  return (
    <div>
      {isOperador ? (
        <AnimalBuscador />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-600">
            Panel de administración. Usá el menú para navegar.
          </p>
        </>
      )}
    </div>
  );
}
