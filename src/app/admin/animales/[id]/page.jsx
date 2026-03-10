"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AnimalForm from "@/components/admin/AnimalForm";
import AnimalInfoCard from "@/components/animal/AnimalInfoCard";
import AnimalAccionesCard from "@/components/animal/AnimalAccionesCard";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const coloresPorEvento = {
  Servicio: { dot: "bg-blue-500", text: "text-blue-600" },
  Parto: { dot: "bg-emerald-500", text: "text-emerald-600" },
  Tacto: { dot: "bg-blue-500", text: "text-blue-600" },
  Secado: { dot: "bg-amber-500", text: "text-amber-600" },
  Aborto: { dot: "bg-red-500", text: "text-red-600" },
};

export default function AnimalPerfilPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
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

  // Unificar eventos para el historial cronológico (ordenados por fecha, más reciente primero)
  const historial = [
    ...(animal.servicios_como_vaca || []).map(e => ({ ...e, tipoEvento: "Servicio" })),
    ...(animal.tactos || []).map(e => ({ ...e, tipoEvento: "Tacto" })),
    ...(animal.partos || []).map(e => ({ ...e, tipoEvento: "Parto" })),
    ...(animal.secados || []).map(e => ({ ...e, tipoEvento: "Secado" })),
    ...(animal.abortos || []).map(e => ({ ...e, tipoEvento: "Aborto" })),
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Botón Volver */}
      <button 
        onClick={() => router.back()}
        className="text-blue-600 hover:underline text-sm font-medium"
      >
        &larr; Volver al listado
      </button>

      <AnimalInfoCard
        animal={animal}
        showEditar={session?.user?.rol === "admin"}
        onEditar={() => setIsEditing(true)}
      />

      <AnimalAccionesCard animal={animal} />

      {/* Historial de Eventos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Historial de Eventos</h2>
        
        {historial.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No hay eventos registrados para este animal.</p>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-[5px] top-[14px] bottom-0 w-0.5 bg-gray-200" />
            {historial.map((evento) => {
              const colores = coloresPorEvento[evento.tipoEvento] || { dot: "bg-gray-500", text: "text-gray-600" };
              return (
                <div key={evento.id} className="relative flex gap-4 pb-6">
                  <span className={`shrink-0 w-3 h-3 rounded-full ring-4 ring-white mt-1.5 -ml-[19px] z-10 ${colores.dot}`} />
                  <div className="flex-1 min-w-0 pt-0.5">
                    <time className={`block text-xs font-bold mb-0.5 ${colores.text}`}>
                      {formatDate(evento.fecha)}
                    </time>
                    <h3 className="font-semibold text-gray-900">{evento.tipoEvento}</h3>
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
              );
            })}
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
