import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const { animal_id, fecha } = await request.json();
    const creadoPor = await getSessionUser();

    if (!animal_id || !fecha) {
      return NextResponse.json(
        { error: "Faltan animal o fecha" },
        { status: 400 }
      );
    }

    const fechaServicio = new Date(fecha);

    const servicio = await prisma.servicio.create({
      data: {
        animal_id,
        fecha: fechaServicio,
        creado_por: creadoPor,
      },
    });

    return NextResponse.json(servicio);
  } catch (error) {
    console.error("POST /api/servicios:", error);
    return NextResponse.json(
      { error: "Error al registrar servicio" },
      { status: 500 }
    );
  }
}
