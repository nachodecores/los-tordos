"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnimalForm({ animalInicial, onSubmitExito, onCancel }) {
  const isEditing = !!animalInicial;
  
  const [formData, setFormData] = useState({
    caravana: animalInicial?.caravana || "",
    tipo: animalInicial?.tipo || "vaca",
    categoria: animalInicial?.categoria || "seca",
    estado: animalInicial?.estado || "activo",
    fecha_nacimiento: animalInicial?.fecha_nacimiento ? animalInicial.fecha_nacimiento.split('T')[0] : "",
    observaciones: animalInicial?.observaciones || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Si cambia de tipo y ya no es vaca, limpiar categoría
      ...(name === "tipo" && value !== "vaca" ? { categoria: "" } : {}),
      // Si cambia a vaca y no tenía categoría, poner 'seca' por defecto
      ...(name === "tipo" && value === "vaca" && !prev.categoria ? { categoria: "seca" } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditing ? `/api/animales/${animalInicial.id}` : "/api/animales";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al guardar el animal");
      }

      const animalGuardado = await res.json();
      if (onSubmitExito) {
        onSubmitExito(animalGuardado);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Caravana *</label>
          <input
            type="text"
            name="caravana"
            required
            value={formData.caravana}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Ej: 1234"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
          <select
            name="tipo"
            required
            value={formData.tipo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="vaca">Vaca</option>
            <option value="vaquillona">Vaquillona</option>
            <option value="toro">Toro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            disabled={formData.tipo !== "vaca"}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500 bg-white"
            required={formData.tipo === "vaca"}
          >
            <option value="">Seleccione...</option>
            {formData.tipo === "vaca" && (
              <>
                <option value="seca">Seca</option>
                <option value="en_ordene">En ordeñe</option>
              </>
            )}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
          <textarea
            name="observaciones"
            rows="3"
            value={formData.observaciones}
            onChange={handleChange}
            placeholder="Notas generales del animal..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
          <div className="flex gap-4">
            {["activo", "vendido", "muerto"].map((estado) => (
              <label key={estado} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="estado"
                  value={estado}
                  checked={formData.estado === estado}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="capitalize">{estado}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Animal"}
        </button>
      </div>
    </form>
  );
}
