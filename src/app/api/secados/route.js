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

    if (!animal || animal.tipo !== "vaca") {
      return NextResponse.json(
        { error: "Solo se puede secar vacas" },
        { status: 400 }
      );
    }

    const secado = await prisma.secado.create({
      data: {
        animal_id,
        fecha: new Date(fecha),
      },
    });

    await prisma.animal.update({
      where: { id: animal_id },
      data: { categoria: "seca" },
    });

    return NextResponse.json(secado);
  } catch (error) {
    console.error("POST /api/secados:", error);
    return NextResponse.json(
      { error: "Error al registrar secado" },
      { status: 500 }
    );
  }
}
