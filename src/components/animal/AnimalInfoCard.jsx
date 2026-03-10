"use client";

import Image from "next/image";

const mapTipo = { vaca: "Vaca", toro: "Toro", vaquillona: "Vaquillona" };
const mapCategoria = { en_ordene: "Ordeñe", seca: "Seca" };

export default function AnimalInfoCard({ animal, showEditar = false, onEditar }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900 flex-1">
          #{animal.caravana}
        </h1>
        {showEditar && onEditar && (
          <button
            onClick={onEditar}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors ml-auto"
            aria-label="Editar"
          >
            <Image
              src="/editicon.svg"
              alt="Editar"
              width={28}
              height={28}
              className="[filter:invert(28%)_sepia(98%)_saturate(2500%)_hue-rotate(206deg)_brightness(96%)_contrast(91%)]"
            />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600">
        {mapTipo[animal.tipo] || animal.tipo}
        {animal.categoria && ` · ${mapCategoria[animal.categoria] || animal.categoria}`}
      </p>
      {animal.tipo !== "toro" && (
        <p className="text-sm text-gray-600 mt-0.5">
          Preñez:{" "}
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
