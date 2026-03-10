"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AnimalForm from "./AnimalForm";

export default function AnimalesListaAdmin() {
  const router = useRouter();
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAltaModal, setShowAltaModal] = useState(false);
  
  // Filtros
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("vaca");
  const [categoria, setCategoria] = useState("");

  const fetchAnimales = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (tipo) params.set("tipo", tipo);
      if (categoria) params.set("categoria", categoria);
      params.set("activos", "true");

      const res = await fetch(`/api/animales?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAnimales(data);
      }
    } catch (error) {
      console.error("Error fetching animales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce para la búsqueda por texto
    const delay = setTimeout(() => {
      fetchAnimales();
    }, 300);
    return () => clearTimeout(delay);
  }, [q, tipo, categoria]);

  const mapCategoria = { en_ordene: "Ordeñe", seca: "Seca" };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header y Filtros */}
      <div className="px-3 py-2 sm:p-4 border-b border-gray-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
            onClick={() => setShowAltaModal(true)}
          >
            + Nuevo Animal
          </button>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Buscar por caravana..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <select 
              value={tipo} 
              onChange={(e) => setTipo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
            >
              <option value="">Todos</option>
              <option value="vaca">Vacas</option>
              <option value="vaquillona">Vaquillonas</option>
              <option value="toro">Toros</option>
            </select>
            <select 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)}
              disabled={tipo && tipo !== 'vaca'}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">Todas</option>
              <option value="en_ordene">Ordeñe</option>
              <option value="seca">Secas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-[10px] uppercase tracking-wider">
              <th className="px-2 py-2 font-medium">#</th>
              <th className="px-2 py-2 font-medium">Categoría</th>
              <th className="px-2 py-2 font-medium">Preñez</th>
              <th className="px-2 py-2 font-medium text-right">Ver</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-2 py-6 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : animales.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-2 py-6 text-center text-gray-500">
                  No se encontraron animales con esos filtros.
                </td>
              </tr>
            ) : (
              animales.map((animal) => (
                <tr key={animal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-2 py-2 font-medium text-gray-900">{animal.caravana}</td>
                  <td className="px-2 py-2">
                    {animal.categoria ? (
                       <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium ${
                        animal.categoria === 'en_ordene' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {mapCategoria[animal.categoria] || animal.categoria}
                        {animal.categoria === 'en_ordene' && animal.dias_desde_parto != null && ` (${animal.dias_desde_parto})`}
                        {animal.categoria === 'seca' && animal.dias_desde_secado != null && ` (${animal.dias_desde_secado})`}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2 py-2 text-gray-600 tabular-nums">
                    {animal.preñez_meses === "N/A" ? "N/A" : animal.preñez_meses || ""}
                  </td>
                  <td className="px-2 py-2 text-right">
                    <Link
                      href={`/admin/animales/${animal.id}`}
                      className="inline-flex p-1 rounded hover:bg-gray-100 transition-colors"
                      aria-label="Ver"
                    >
                      <Image
                        src="/openicon.svg"
                        alt="Ver"
                        width={18}
                        height={18}
                        className="[filter:invert(28%)_sepia(98%)_saturate(2500%)_hue-rotate(206deg)_brightness(96%)_contrast(91%)]"
                      />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center">
        Mostrando {animales.length} resultados
      </div>

      {/* Modal de Alta de Animal */}
      {showAltaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Nuevo Animal</h3>
              <button onClick={() => setShowAltaModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6">
              <AnimalForm 
                onCancel={() => setShowAltaModal(false)}
                onSubmitExito={(nuevoAnimal) => {
                  setShowAltaModal(false);
                  fetchAnimales(); // recargar lista
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
