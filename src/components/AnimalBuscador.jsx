"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnimalBuscador({ showVolver = false, listarTodos = false, hideTitle = false }) {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (listarTodos) {
      setLoading(true);
      fetch("/api/animales")
        .then((res) => res.json())
        .then((data) => {
          setResultados(Array.isArray(data) ? data : []);
          setSeleccionado(null);
        })
        .catch(() => setResultados([]))
        .finally(() => setLoading(false));
      return;
    }
    if (busqueda.length < 1) {
      setResultados([]);
      setSeleccionado(null);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/animales?q=${encodeURIComponent(busqueda)}`)
        .then((res) => res.json())
        .then((data) => {
          setResultados(Array.isArray(data) ? data : []);
          setSeleccionado(null);
        })
        .catch(() => setResultados([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda, listarTodos]);

  function formatearCategoria(cat) {
    if (!cat) return "-";
    return cat === "en_ordene" ? "En ordeñe" : "Seca";
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
            <li
              key={animal.id}
              onClick={() =>
                setSeleccionado(seleccionado?.id === animal.id ? null : animal)
              }
              className={`border rounded-lg p-4 cursor-pointer transition ${
                seleccionado?.id === animal.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">{animal.caravana}</span>
                <span className="text-gray-600 text-sm">
                  {formatearTipo(animal.tipo)}
                  {animal.categoria && ` · ${formatearCategoria(animal.categoria)}`}
                </span>
              </div>
                {seleccionado?.id === animal.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/admin/animales/${animal.id}/servicio`}
                      prefetch={false}
                      className="flex-1 min-w-[100px] bg-green-600 text-white text-center py-2 rounded-lg font-medium hover:bg-green-700"
                    >
                      SERVICIO
                    </Link>
                    {(animal.tipo === "vaca" || animal.tipo === "vaquillona") && (
                      <Link
                        href={`/admin/animales/${animal.id}/tacto`}
                        prefetch={false}
                        className="flex-1 min-w-[100px] bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700"
                      >
                        TACTO
                      </Link>
                    )}
                    <Link
                      href={`/admin/animales/${animal.id}/parto`}
                      prefetch={false}
                      className="flex-1 min-w-[100px] bg-amber-600 text-white text-center py-2 rounded-lg font-medium hover:bg-amber-700"
                    >
                      PARTO
                    </Link>
                    {animal.tipo === "vaca" && animal.categoria === "en_ordene" && (
                      <Link
                        href={`/admin/animales/${animal.id}/secado`}
                        prefetch={false}
                        className="flex-1 min-w-[100px] bg-slate-600 text-white text-center py-2 rounded-lg font-medium hover:bg-slate-700"
                      >
                        SECADO
                      </Link>
                    )}
                    {(animal.tipo === "vaca" || animal.tipo === "vaquillona") && (
                      <Link
                        href={`/admin/animales/${animal.id}/aborto`}
                        prefetch={false}
                        className="flex-1 min-w-[100px] bg-rose-600 text-white text-center py-2 rounded-lg font-medium hover:bg-rose-700"
                      >
                        ABORTO
                      </Link>
                    )}
                    </div>
                  </div>
                )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
