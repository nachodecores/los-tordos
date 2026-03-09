"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AnimalForm from "@/components/admin/AnimalForm";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function AnimalPerfilPage() {
  const { id } = useParams();
  const router = useRouter();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const fetchAnimal = async () => {
    try {
      const res = await fetch(`/api/animales/${id}`);
      if (!res.ok) throw new Error("Animal no encontrado");
      const data = await res.json();
      setAnimal(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimal();
  }, [id]);

  if (loading) return <div className="p-4 text-gray-500">Cargando perfil...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!animal) return null;

  // Unificar eventos para el historial cronológico
  const historial = [
    ...(animal.servicios_como_vaca || []).map(e => ({ ...e, tipoEvento: "Servicio" })),
    ...(animal.tactos || []).map(e => ({ ...e, tipoEvento: "Tacto" })),
    ...(animal.partos || []).map(e => ({ ...e, tipoEvento: "Parto" })),
    ...(animal.secados || []).map(e => ({ ...e, tipoEvento: "Secado" })),
    ...(animal.abortos || []).map(e => ({ ...e, tipoEvento: "Aborto" })),
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const mapTipo = { vaca: "Vaca", toro: "Toro", vaquillona: "Vaquillona" };
  const mapCategoria = { en_ordene: "En ordeñe", seca: "Seca" };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Botón Volver */}
      <button 
        onClick={() => router.back()}
        className="text-blue-600 hover:underline text-sm font-medium"
      >
        &larr; Volver al listado
      </button>

      {/* Tarjeta Principal de Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Caravana {animal.caravana}
              </h1>
              <button 
                onClick={() => setIsEditing(true)}
                className="text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded"
              >
                Editar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                {mapTipo[animal.tipo] || animal.tipo}
              </span>
              {animal.categoria && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                  {mapCategoria[animal.categoria] || animal.categoria}
                </span>
              )}
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                animal.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {animal.estado}
              </span>
            </div>
            {animal.observaciones && (
              <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {animal.observaciones}
              </p>
            )}
          </div>
          
          {/* Acciones Rápidas */}
          {animal.tipo !== 'toro' && animal.estado === 'activo' && (
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/animales/${animal.id}/servicio`}
                className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100"
              >
                + Servicio
              </Link>
              <Link
                href={`/admin/animales/${animal.id}/tacto`}
                className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100"
              >
                + Tacto
              </Link>
              <Link
                href={`/admin/animales/${animal.id}/parto`}
                className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-100"
              >
                + Parto
              </Link>
              {animal.tipo === 'vaca' && (
                <Link
                  href={`/admin/animales/${animal.id}/secado`}
                  className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-100"
                >
                  + Secado
                </Link>
              )}
              <Link
                href={`/admin/animales/${animal.id}/aborto`}
                className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100"
              >
                + Aborto
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Historial de Eventos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Historial de Eventos</h2>
        
        {historial.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No hay eventos registrados para este animal.</p>
        ) : (
          <div 
            className="flex overflow-x-auto pb-4 pt-2 gap-6 snap-x"
            style={{ scrollbarWidth: 'thin' }}
          >
            {historial.map((evento, index) => (
              <div key={evento.id} className="relative flex-none w-64 snap-start">
                {/* Línea horizontal de conexión */}
                <div className="absolute top-1.5 left-3 w-[calc(100%+1.5rem)] h-0.5 bg-gray-200 -z-10"></div>
                
                {/* Puntito del timeline */}
                <span className="absolute w-3 h-3 bg-blue-500 rounded-full left-0 top-1 ring-4 ring-white z-10"></span>
                
                <div className="pt-6 pl-1 pr-4">
                  <time className="block text-xs font-bold text-blue-600 mb-1">
                    {formatDate(evento.fecha)}
                  </time>
                  <h3 className="font-semibold text-gray-900">{evento.tipoEvento}</h3>
                  
                  {/* Detalles específicos por tipo de evento */}
                  {evento.tipoEvento === "Tacto" && (
                    <div className="text-sm mt-2 bg-gray-50 p-2 rounded-md border border-gray-100">
                      <div className="font-medium capitalize">{evento.resultado}</div>
                      {evento.fecha_estimada_parto && (
                        <div className="text-gray-500 text-xs mt-1">
                          Parto est: {formatDate(evento.fecha_estimada_parto)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Editar Animal {animal.caravana}</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6">
              <AnimalForm 
                animalInicial={animal}
                onCancel={() => setIsEditing(false)}
                onSubmitExito={(animalActualizado) => {
                  setIsEditing(false);
                  fetchAnimal(); // Recargar datos del perfil
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
