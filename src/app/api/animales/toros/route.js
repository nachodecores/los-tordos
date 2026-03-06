import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const toros = await prisma.animal.findMany({
      where: { tipo: "toro", estado: "activo" },
      orderBy: { caravana: "asc" },
    });
    return NextResponse.json(toros);
  } catch (error) {
    console.error("GET /api/animales/toros:", error);
    return NextResponse.json(
      { error: "Error al buscar toros" },
      { status: 500 }
    );
  }
}
