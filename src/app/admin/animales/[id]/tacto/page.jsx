"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";

export default function TactoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [animal, setAnimal] = useState(null);
  const [ultimoServicio, setUltimoServicio] = useState(null);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estado para la UI
  const [modoCorregir, setModoCorregir] = useState(false);
  const [resultadoManual, setResultadoManual] = useState("prenada"); // 'prenada' o 'vacia'
  const [mesesManual, setMesesManual] = useState("1"); // 1 a 9 meses

  useEffect(() => {
    fetch(`/api/animales/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setAnimal(data);
        // Buscar el servicio más reciente si existe
        if (data.servicios_como_vaca && data.servicios_como_vaca.length > 0) {
          const sorted = data.servicios_como_vaca.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
          setUltimoServicio(sorted[0]);
        }
      });
  }, [id]);

  // Cálculos para la vista de "Confirmar"
  const calcularPrenezEstimada = () => {
    if (!ultimoServicio) return null;
    const diasGestacion = differenceInDays(new Date(fecha), new Date(ultimoServicio.fecha));
    const mesesGestacion = Math.floor(diasGestacion / 30);
    
    // Parto estimado = Fecha de servicio + 283 días
    const fechaParto = new Date(ultimoServicio.fecha);
    fechaParto.setDate(fechaParto.getDate() + 283);

    return {
      dias: diasGestacion,
      meses: mesesGestacion,
      fechaParto: format(fechaParto, "dd/MM/yyyy"),
      fechaPartoRaw: fechaParto
    };
  };

  const prenez = calcularPrenezEstimada();

  async function handleSubmit(e, esConfirmacion = false) {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let payload = {
        animal_id: id,
        fecha,
      };

      if (esConfirmacion && ultimoServicio) {
        // Camino A: CONFIRMAR el servicio registrado
        payload.resultado = "prenada";
        payload.servicio_id = ultimoServicio.id;
        payload.fecha_estimada_parto = prenez.fechaPartoRaw.toISOString();
      } else {
        // Camino B: CORREGIR (o si no había servicio previo)
        payload.resultado = resultadoManual;
        
        if (resultadoManual === "prenada") {
          // Si está preñada, calculamos la fecha de parto basándonos en los meses ingresados
          // Le faltan = 9 meses (283 días) - meses actuales
          const fechaParto = new Date(fecha);
          const diasFaltantes = 283 - (parseInt(mesesManual) * 30.5); // aproximación
          fechaParto.setDate(fechaParto.getDate() + diasFaltantes);
          payload.fecha_estimada_parto = fechaParto.toISOString();
        } else {
          // Si está vacía
          payload.fecha_estimada_parto = null;
        }
      }

      const res = await fetch("/api/tactos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar tacto");
      
      // Volver al perfil del animal
      router.push(`/admin/animales/${id}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (!animal) return <div className="p-6">Cargando...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <Link href={`/admin/animales/${id}`} className="text-blue-600 hover:underline text-sm font-medium">
          &larr; Volver al perfil
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Registrar Tacto</h1>
        <p className="text-gray-600">Caravana: <span className="font-bold text-gray-900">{animal.caravana}</span></p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del tacto</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      {!modoCorregir ? (
        // VISTA PRINCIPAL: Información del Servicio + Botones Confirmar/Corregir
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-blue-50/50">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Supuesta Preñez</h2>
            
            {ultimoServicio ? (
              <div className="space-y-2">
                <p className="text-lg font-bold text-blue-900">
                  {prenez.meses > 0 ? `Aprox. ${prenez.meses} meses` : `${prenez.dias} días`} de gestación
                </p>
                <p className="text-sm text-gray-600">
                  Servicio registrado el: <span className="font-medium">{format(new Date(ultimoServicio.fecha), "dd/MM/yyyy")}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Parto estimado: <span className="font-medium">{prenez.fechaParto}</span>
                </p>
              </div>
            ) : (
              <div className="py-2">
                <p className="text-gray-600 font-medium">Sin servicio reciente registrado.</p>
                <p className="text-sm text-gray-500 mt-1">Deberá ingresar la preñez manualmente.</p>
              </div>
            )}
          </div>

          <div className="p-5 space-y-4">
            {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}
            
            {ultimoServicio && (
              <button
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading}
                className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50 flex flex-col items-center"
              >
                <span>CONFIRMAR PREÑEZ</span>
                <span className="text-xs font-normal text-emerald-100 mt-1">Calcula el parto automáticamente</span>
              </button>
            )}

            <button
              onClick={() => setModoCorregir(true)}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-colors shadow-sm disabled:opacity-50 ${
                ultimoServicio 
                  ? "bg-amber-100 text-amber-800 hover:bg-amber-200" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {ultimoServicio ? "CORREGIR DATOS" : "INGRESAR TACTO MANUAL"}
            </button>
          </div>
        </div>
      ) : (
        // VISTA CORREGIR: Formulario manual (Vacía o X meses)
        <form onSubmit={(e) => handleSubmit(e, false)} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-5 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-800">Resultado Manual</h2>
            {ultimoServicio && (
              <button 
                type="button" 
                onClick={() => setModoCorregir(false)}
                className="text-sm text-blue-600 hover:underline"
              >
                Cancelar
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setResultadoManual("prenada")}
              className={`py-3 rounded-lg border-2 font-bold transition-all ${
                resultadoManual === "prenada" 
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                  : "border-gray-200 text-gray-500 hover:border-emerald-200"
              }`}
            >
              PREÑADA
            </button>
            <button
              type="button"
              onClick={() => setResultadoManual("vacia")}
              className={`py-3 rounded-lg border-2 font-bold transition-all ${
                resultadoManual === "vacia" 
                  ? "border-red-500 bg-red-50 text-red-700" 
                  : "border-gray-200 text-gray-500 hover:border-red-200"
              }`}
            >
              VACÍA
            </button>
          </div>

          {resultadoManual === "prenada" && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿De cuántos meses está? (Aprox)
              </label>
              <select
                value={mesesManual}
                onChange={(e) => setMesesManual(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1,2,3,4,5,6,7,8,9].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'mes' : 'meses'}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                * El sistema calculará la fecha estimada de parto sumándole los meses restantes.
              </p>
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Guardando..." : "GUARDAR TACTO"}
          </button>
        </form>
      )}
    </div>
  );
}
