import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { animal_id, fecha, observaciones } = await request.json();

    if (!animal_id || !fecha) {
      return NextResponse.json(
        { error: "Faltan animal o fecha" },
        { status: 400 }
      );
    }

    const fechaServicio = new Date(fecha);

    const periodo = await prisma.periodoToro.findFirst({
      where: {
        AND: [
          { fecha_inicio: { lte: fechaServicio } },
          {
            OR: [
              { fecha_fin: null },
              { fecha_fin: { gte: fechaServicio } },
            ],
          },
        ],
      },
      orderBy: { fecha_inicio: "desc" },
      include: { toro: true },
    });

    if (!periodo) {
      return NextResponse.json(
        {
          error: "No hay toro registrado para esa fecha. Un admin debe cargar el período del toro.",
        },
        { status: 400 }
      );
    }

    const servicio = await prisma.servicio.create({
      data: {
        animal_id,
        toro_id: periodo.toro_id,
        fecha: fechaServicio,
        observaciones: observaciones || null,
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
