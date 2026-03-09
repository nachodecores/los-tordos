import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        servicios_como_vaca: { orderBy: { fecha: 'desc' } },
        tactos: { orderBy: { fecha: 'desc' } },
        partos: { orderBy: { fecha: 'desc' } },
        secados: { orderBy: { fecha: 'desc' } },
        abortos: { orderBy: { fecha: 'desc' } },
      },
    });
    if (!animal) {
      return NextResponse.json({ error: "Animal no encontrado" }, { status: 404 });
    }
    return NextResponse.json(animal);
  } catch (error) {
    console.error("GET /api/animales/[id]:", error);
    return NextResponse.json(
      { error: "Error al buscar animal" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { caravana, tipo, categoria, estado, fecha_nacimiento, observaciones } = await request.json();

    const animal = await prisma.animal.update({
      where: { id },
      data: {
        caravana,
        tipo,
        categoria: tipo === "vaca" ? categoria || "seca" : null,
        estado,
        fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : null,
        observaciones: observaciones || null,
      },
    });

    return NextResponse.json(animal);
  } catch (error) {
    console.error("PUT /api/animales/[id]:", error);
    return NextResponse.json({ error: "Error al actualizar animal" }, { status: 500 });
  }
}
