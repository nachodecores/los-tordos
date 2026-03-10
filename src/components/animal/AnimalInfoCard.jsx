"use client";

const mapTipo = { vaca: "Vaca", toro: "Toro", vaquillona: "Vaquillona" };
const mapCategoria = { en_ordene: "Ordeñe", seca: "Seca" };

export default function AnimalInfoCard({ animal, showEditar = false, onEditar }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Caravana {animal.caravana}
        </h1>
        {showEditar && onEditar && (
          <button
            onClick={onEditar}
            className="text-xs font-medium text-gray-600 hover:text-gray-800"
          >
            Editar
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600">
        {mapTipo[animal.tipo] || animal.tipo}
        {animal.categoria && ` · ${mapCategoria[animal.categoria] || animal.categoria}`}
      </p>
      {animal.tipo !== "toro" && (
        <p className="text-sm text-gray-600 mt-0.5">
          {animal.preñez_meses === "N/A"
            ? "N/A"
            : animal.preñez_meses
              ? `Preñada ${animal.preñez_meses} meses`
              : "Vacía"}
        </p>
      )}
      {animal.observaciones && (
        <p className="text-sm text-gray-600 mt-2">{animal.observaciones}</p>
      )}
    </div>
  );
}
