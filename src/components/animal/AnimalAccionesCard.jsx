"use client";

import Link from "next/link";

export default function AnimalAccionesCard({ animal, basePath = "/admin/animales" }) {
  if (animal.tipo === "toro" || animal.estado !== "activo") return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Acciones</h2>
      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`${basePath}/${animal.id}/servicio`}
          className="row-span-2 flex min-h-[6.5rem] items-center justify-center bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-800"
        >
          + Servicio
        </Link>
        <Link
          href={`${basePath}/${animal.id}/parto`}
          className="row-span-2 flex min-h-[6.5rem] items-center justify-center bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-800"
        >
          + Parto
        </Link>
        <Link
          href={`${basePath}/${animal.id}/tacto`}
          className="flex min-h-[3rem] items-center justify-center bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-800"
        >
          + Tacto
        </Link>
        {animal.tipo === "vaca" && (
          <Link
            href={`${basePath}/${animal.id}/secado`}
            className="row-span-2 flex min-h-[6.5rem] items-center justify-center bg-amber-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-800"
          >
            + Secado
          </Link>
        )}
        <Link
          href={`${basePath}/${animal.id}/aborto`}
          className="flex min-h-[3rem] items-center justify-center bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-800"
        >
          + Aborto
        </Link>
      </div>
    </div>
  );
}
