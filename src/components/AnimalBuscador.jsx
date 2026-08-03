"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnimalBuscador({ showVolver = false, listarTodos = false, hideTitle = false }) {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (listarTodos) {
      setLoading(true);
      fetch("/api/animales")
        .then((res) => res.json())
        .then((data) => {
          setResultados(Array.isArray(data) ? data : []);
        })
        .catch(() => setResultados([]))
        .finally(() => setLoading(false));
      return;
    }
    if (busqueda.length < 1) {
      setResultados([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/animales?q=${encodeURIComponent(busqueda)}`)
        .then((res) => res.json())
        .then((data) => {
          setResultados(Array.isArray(data) ? data : []);
        })
        .catch(() => setResultados([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda, listarTodos]);

  function formatearCategoria(cat) {
    if (!cat) return "-";
    if (cat === "en_ordene") return "En ordeñe";
    if (cat === "seca") return "Seca";
    if (cat === "vaquillona") return "Vaquillona";
    return cat;
  }

  function formatearTipo(tipo) {
    const map = { vaca: "Vaca", toro: "Toro", vaquillona: "Vaquillona" };
    return map[tipo] || tipo;
  }

  const listaMostrar = listarTodos && busqueda.trim()
    ? resultados.filter((a) =>
        a.caravana.toLowerCase().includes(busqueda.trim().toLowerCase())
      )
    : resultados;

  return (
    <div className="max-w-2xl">
      {showVolver && (
        <div className="mb-4">
          <Link href="/admin" className="text-blue-600 hover:underline text-sm">
            ← Volver
          </Link>
        </div>
      )}
      {!hideTitle && (
        <h1 className="text-2xl font-bold mb-4">
          {listarTodos ? "Todos los animales" : "Buscar animal"}
        </h1>
      )}
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder={listarTodos ? "Filtrar por caravana..." : "Caravana (ej: 53, 0362)"}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg mb-4"
        autoFocus={!listarTodos}
      />

      {loading && (
        <p className="text-gray-500 text-sm mb-2">
          {listarTodos ? "Cargando..." : "Buscando..."}
        </p>
      )}

      {!loading && !listarTodos && busqueda && resultados.length === 0 && (
        <p className="text-gray-500">No se encontraron animales.</p>
      )}

      {!loading && listarTodos && resultados.length === 0 && (
        <p className="text-gray-500">No hay animales cargados.</p>
      )}

      {!loading && listarTodos && busqueda.trim() && listaMostrar.length === 0 && (
        <p className="text-gray-500">Ningún animal coincide con el filtro.</p>
      )}

      {!loading && listaMostrar.length > 0 && (
        <ul className="space-y-2 mb-6">
          {listaMostrar.map((animal) => (
            <li key={animal.id}>
              <Link
                href={`/admin/animales/${animal.id}`}
                className="block border border-gray-200 rounded-lg p-4 transition hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{animal.caravana}</span>
                  <span className="text-gray-600 text-sm">
                    {formatearTipo(animal.tipo)}
                    {animal.categoria && ` · ${formatearCategoria(animal.categoria)}`}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
