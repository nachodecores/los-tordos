import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { animal_id, fecha } = await request.json();

    if (!animal_id || !fecha) {
      return NextResponse.json(
        { error: "Faltan animal o fecha" },
        { status: 400 }
      );
    }

    const animal = await prisma.animal.findUnique({
      where: { id: animal_id },
    });

    if (!animal || (animal.tipo !== "vaca" && animal.tipo !== "vaquillona")) {
      return NextResponse.json(
        { error: "Solo se puede registrar aborto en vacas o vaquillonas" },
        { status: 400 }
      );
    }

    const aborto = await prisma.aborto.create({
      data: {
        animal_id,
        fecha: new Date(fecha),
      },
    });

    return NextResponse.json(aborto);
  } catch (error) {
    console.error("POST /api/abortos:", error);
    return NextResponse.json(
      { error: "Error al registrar aborto" },
      { status: 500 }
    );
  }
}
