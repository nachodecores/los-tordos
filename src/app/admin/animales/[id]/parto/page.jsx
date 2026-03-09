"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PartoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [animal, setAnimal] = useState(null);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/animales/${id}`)
      .then((r) => r.json())
      .then(setAnimal);
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/partos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animal_id: id,
          fecha,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      router.push("/admin/animales");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!animal) return <div className="p-6">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <Link href="/admin/animales" className="text-blue-600 hover:underline text-sm mb-4 block">
          ← Volver al buscador
        </Link>
        <h1 className="text-xl font-bold mb-2">Registrar parto</h1>
        <p className="text-gray-600 mb-6">Animal: <strong>{animal.caravana}</strong></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-2 rounded font-medium hover:bg-amber-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar parto"}
          </button>
        </form>
      </div>
    </div>
  );
}
