"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, 
  LineChart, Line, 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList 
} from 'recharts';

export default function InformesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Rinde promedio esperado en litros por vaca por día
  const [rindePromedio, setRindePromedio] = useState(16);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/informes/proyecciones");
        if (!res.ok) throw new Error("Error al obtener los datos");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-4 text-gray-500">Calculando proyecciones...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!data) return null;

  // Enriquecer la proyección con la producción estimada
  const datosGrafico = data.proyeccion.map(mes => {
    // Estimación: Vacas en ordeñe * rinde promedio * 30 días (aproximado)
    const produccionEstimada = mes.vacasEnOrdeneProyectadas * rindePromedio * 30;
    return {
      ...mes,
      produccion: Math.round(produccionEstimada)
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Informes y Proyecciones</h1>
        <p className="text-gray-600 text-sm mt-1">
          Análisis del estado actual del rodeo y proyecciones a 12 meses.
        </p>
      </div>

      {/* Tarjetas de Resumen Actual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Vacas en Ordeñe</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">{data.actual.vacasEnOrdene}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Vacas Secas</h3>
          <p className="text-2xl font-bold text-amber-600 mt-1">{data.actual.vacasSecas}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Vaquillonas</h3>
          <p className="text-2xl font-bold text-pink-600 mt-1">{data.actual.vaquillonas}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Gráfico 1: Partos Esperados */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Partos Esperados</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosGrafico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fontSize: 12}} dx={-10} />
                <Bar dataKey="partosEsperados" name="Nuevos Partos" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Evolución de Vacas en Ordeñe */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Proyección de Vacas en Ordeñe</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosGrafico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis allowDecimals={false} domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{fontSize: 12}} dx={-10} />
                <Line type="monotone" dataKey="vacasEnOrdeneProyectadas" name="Vacas Ordeñándose" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}}>
                  <LabelList dataKey="vacasEnOrdeneProyectadas" position="top" style={{fontSize: 11}} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 3: Estimación de Producción de Leche */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-lg font-bold text-gray-800">Estimación de Producción Total</h2>
            
            {/* Input para modificar la variable del gráfico */}
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
              <label htmlFor="rinde" className="text-sm font-medium text-gray-700">
                Rinde prom. esperado:
              </label>
              <div className="relative">
                <input
                  id="rinde"
                  type="number"
                  min="5"
                  max="50"
                  value={rindePromedio}
                  onChange={(e) => setRindePromedio(Number(e.target.value))}
                  className="w-20 pl-2 pr-6 py-1 border border-gray-300 rounded text-sm font-bold text-blue-600 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Lts</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosGrafico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis 
                  domain={[18000, 'auto']}
                  tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} 
                  axisLine={false} tickLine={false} tick={{fontSize: 12}} dx={-10} 
                />
                <Line type="monotone" dataKey="produccion" name="Producción Total (Litros)" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}}>
                <LabelList dataKey="produccion" position="top" formatter={(v) => `${(v/1000).toFixed(1)}k`} style={{fontSize: 11}} />
              </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4 italic">
            Cálculo: Vacas en ordeñe mensuales × rinde promedio ingresado × 30 días.
          </p>
        </div>

      </div>
    </div>
  );
}
