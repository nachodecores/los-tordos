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

    const parto = await prisma.parto.create({
      data: {
        animal_id,
        fecha: new Date(fecha),
        creado_por: creadoPor,
      },
    });

    // Si es vaquillona, pasar a vaca en ordeñe
    const animal = await prisma.animal.findUnique({
      where: { id: animal_id },
    });
    if (animal?.tipo === "vaquillona") {
      await prisma.animal.update({
        where: { id: animal_id },
        data: { tipo: "vaca", categoria: "en_ordene", actualizado_por: creadoPor },
      });
    }

    return NextResponse.json(parto);
  } catch (error) {
    console.error("POST /api/partos:", error);
    return NextResponse.json(
      { error: "Error al registrar parto" },
      { status: 500 }
    );
  }
}
