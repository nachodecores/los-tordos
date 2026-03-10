"use client";

import Link from "next/link";

export default function AnimalAccionesCard({ animal, basePath = "/admin/animales" }) {
  if (animal.tipo === "toro" || animal.estado !== "activo") return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Agregar evento</h2>
      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`${basePath}/${animal.id}/servicio`}
          className="row-span-2 flex w-full min-h-[6.5rem] items-center justify-center bg-blue-700 text-white p-2 rounded-lg font-medium hover:bg-blue-800 text-[clamp(0.7rem,2.5vmin,1.1rem)] leading-tight"
        >
          + Servicio
        </Link>
        <Link
          href={`${basePath}/${animal.id}/parto`}
          className="row-span-2 flex w-full min-h-[6.5rem] items-center justify-center bg-emerald-700 text-white p-2 rounded-lg font-medium hover:bg-emerald-800 text-[clamp(0.7rem,2.5vmin,1.1rem)] leading-tight"
        >
          + Parto
        </Link>
        <Link
          href={`${basePath}/${animal.id}/tacto`}
          className="flex w-full min-h-[3rem] items-center justify-center bg-black text-white p-2 rounded-lg font-medium hover:bg-gray-900 text-[clamp(0.6rem,2vmin,0.95rem)] leading-tight"
        >
          + Tacto
        </Link>
        {animal.tipo === "vaca" && (
          <Link
            href={`${basePath}/${animal.id}/secado`}
            className="row-span-2 flex w-full min-h-[6.5rem] items-center justify-center bg-amber-700 text-white p-2 rounded-lg font-medium hover:bg-amber-800 text-[clamp(0.7rem,2.5vmin,1.1rem)] leading-tight"
          >
            + Secado
          </Link>
        )}
        <Link
          href={`${basePath}/${animal.id}/aborto`}
          className="flex w-full min-h-[3rem] items-center justify-center bg-red-700 text-white p-2 rounded-lg font-medium hover:bg-red-800 text-[clamp(0.6rem,2vmin,0.95rem)] leading-tight"
        >
          + Aborto
        </Link>
      </div>
    </div>
  );
}
