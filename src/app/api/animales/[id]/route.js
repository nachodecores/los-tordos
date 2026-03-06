import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const animal = await prisma.animal.findUnique({
      where: { id },
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
