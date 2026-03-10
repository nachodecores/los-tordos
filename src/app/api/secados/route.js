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
        creado_por: creadoPor,
      },
    });

    await prisma.animal.update({
      where: { id: animal_id },
      data: { categoria: "seca", actualizado_por: creadoPor },
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
