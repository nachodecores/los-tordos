"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const TIPO_LABEL = {
  servicio: "Servicio",
  tacto: "Tacto",
  parto: "Parto",
  secado: "Secado",
  aborto: "Aborto",
  alta_animal: "Alta de animal",
};

const TIPO_BADGE = {
  servicio: "bg-blue-100 text-blue-800",
  tacto: "bg-purple-100 text-purple-800",
  parto: "bg-green-100 text-green-800",
  secado: "bg-amber-100 text-amber-800",
  aborto: "bg-red-100 text-red-800",
  alta_animal: "bg-gray-200 text-gray-700",
};

export default function AuditoriaPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tipoEvento, setTipoEvento] = useState("");
  const [q, setQ] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      async function fetchEventos() {
        setLoading(true);
        setError("");
        try {
          const params = new URLSearchParams();
          if (tipoEvento) params.set("tipo_evento", tipoEvento);
          if (q) params.set("q", q);
          if (desde) params.set("desde", desde);
          if (hasta) params.set("hasta", hasta);

          const res = await fetch(`/api/auditoria?${params.toString()}`);
          if (!res.ok) throw new Error("Error al obtener la auditoría");
          const data = await res.json();
          setEventos(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchEventos();
    }, 300);
    return () => clearTimeout(delay);
  }, [tipoEvento, q, desde, hasta]);

  const formatFecha = (value) =>
    new Date(value).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const formatFechaHora = (value) =>
    new Date(value).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Auditoría</h1>
        <p className="text-gray-600 text-sm mt-1">
          Bitácora de todos los eventos registrados: quién agregó qué y cuándo.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Filtros */}
        <div className="px-3 py-2 sm:p-4 border-b border-gray-200 space-y-2">
          <input
            type="text"
            placeholder="Buscar por caravana..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={tipoEvento}
              onChange={(e) => setTipoEvento(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
            >
              <option value="">Todos los eventos</option>
              {Object.entries(TIPO_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            />
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-[10px] uppercase tracking-wider">
                <th className="px-2 py-2 font-medium">Fecha</th>
                <th className="px-2 py-2 font-medium">Evento</th>
                <th className="px-2 py-2 font-medium">Caravana</th>
                <th className="px-2 py-2 font-medium">Cargado por</th>
                <th className="px-2 py-2 font-medium">Fecha de carga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-2 py-6 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-2 py-6 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : eventos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-2 py-6 text-center text-gray-500">
                    No se encontraron eventos con esos filtros.
                  </td>
                </tr>
              ) : (
                eventos.map((evento) => (
                  <tr
                    key={`${evento.tipo_evento}-${evento.evento_id}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 py-2 text-gray-900 tabular-nums">{formatFecha(evento.fecha)}</td>
                    <td className="px-2 py-2">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium ${
                          TIPO_BADGE[evento.tipo_evento] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {TIPO_LABEL[evento.tipo_evento] || evento.tipo_evento}
                      </span>
                    </td>
                    <td className="px-2 py-2 font-medium text-gray-900">
                      <Link
                        href={`/admin/animales/${evento.animal_id}`}
                        className="text-colorpurple4 hover:underline"
                      >
                        {evento.caravana}
                      </Link>
                    </td>
                    <td className="px-2 py-2 text-gray-600">{evento.creado_por || "-"}</td>
                    <td className="px-2 py-2 text-gray-500 tabular-nums">{formatFechaHora(evento.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center">
          Mostrando {eventos.length} eventos
        </div>
      </div>
    </div>
  );
}
