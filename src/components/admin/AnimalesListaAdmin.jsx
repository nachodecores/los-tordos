"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimalForm from "./AnimalForm";

export default function AnimalesListaAdmin() {
  const router = useRouter();
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAltaModal, setShowAltaModal] = useState(false);
  
  // Filtros
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [activos, setActivos] = useState(true);

  const fetchAnimales = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (tipo) params.set("tipo", tipo);
      if (categoria) params.set("categoria", categoria);
      params.set("activos", activos);

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
  }, [q, tipo, categoria, activos]);

  const mapTipo = { vaca: "Vaca", toro: "Toro", vaquillona: "Vaquillona" };
  const mapCategoria = { en_ordene: "En ordeñe", seca: "Seca" };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header y Filtros */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-800">Directorio de Animales</h2>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
            onClick={() => setShowAltaModal(true)}
          >
            + Nuevo Animal
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Buscar por caravana..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
          
          <select 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
          >
            <option value="">Todos los tipos</option>
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
            <option value="">Todas las categorías</option>
            <option value="en_ordene">En ordeñe</option>
            <option value="seca">Secas</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activos}
              onChange={(e) => setActivos(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Solo activos
          </label>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Caravana</th>
              <th className="p-4 font-medium">Tipo</th>
              <th className="p-4 font-medium hidden sm:table-cell">Categoría</th>
              <th className="p-4 font-medium hidden md:table-cell">Estado</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : animales.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No se encontraron animales con esos filtros.
                </td>
              </tr>
            ) : (
              animales.map((animal) => (
                <tr key={animal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{animal.caravana}</td>
                  <td className="p-4 text-gray-700">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      animal.tipo === 'vaca' ? 'bg-purple-100 text-purple-800' :
                      animal.tipo === 'vaquillona' ? 'bg-pink-100 text-pink-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {mapTipo[animal.tipo] || animal.tipo}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700 hidden sm:table-cell">
                    {animal.categoria ? (
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        animal.categoria === 'en_ordene' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {mapCategoria[animal.categoria] || animal.categoria}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-700 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      animal.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {animal.estado}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/animales/${animal.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Ver perfil &rarr;
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Paginación simple (opcional a futuro) */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center">
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
