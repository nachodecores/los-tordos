import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const activos = searchParams.get("activos") !== "false";

    const where = {};

    if (q) {
      where.caravana = { contains: q, mode: "insensitive" };
    }
    if (activos) {
      where.estado = "activo";
    }

    const animales = await prisma.animal.findMany({
      where,
      orderBy: { caravana: "asc" },
    });

    return NextResponse.json(animales);
  } catch (error) {
    console.error("GET /api/animales:", error);
    return NextResponse.json(
      { error: "Error al buscar animales" },
      { status: 500 }
    );
  }
}
