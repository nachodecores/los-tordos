import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { animal_id, fecha, resultado, fecha_estimada_parto, servicio_id } = await request.json();

    if (!animal_id || !fecha || !resultado) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios (animal, fecha, resultado)" },
        { status: 400 }
      );
    }

    const tacto = await prisma.tacto.create({
      data: {
        animal_id,
        fecha: new Date(fecha),
        resultado, // 'prenada' o 'vacia'
        fecha_estimada_parto: fecha_estimada_parto ? new Date(fecha_estimada_parto) : null,
        servicio_id: servicio_id || null,
      },
    });

    return NextResponse.json(tacto, { status: 201 });
  } catch (error) {
    console.error("POST /api/tactos:", error);
    return NextResponse.json(
      { error: "Error al registrar tacto" },
      { status: 500 }
    );
  }
}
