import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const activos = searchParams.get("activos") !== "false";
    const tipo = searchParams.get("tipo");
    const categoria = searchParams.get("categoria");

    const where = {};

    if (q) {
      where.caravana = { contains: q, mode: "insensitive" };
    }
    if (activos) {
      where.estado = "activo";
    }
    if (tipo) {
      where.tipo = tipo;
    }
    if (categoria) {
      where.categoria = categoria;
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

export async function POST(request) {
  try {
    const { caravana, tipo, categoria, estado, fecha_nacimiento, observaciones } = await request.json();

    if (!caravana || !tipo || !estado) {
      return NextResponse.json({ error: "Faltan campos obligatorios (caravana, tipo, estado)" }, { status: 400 });
    }

    const existe = await prisma.animal.findUnique({
      where: { caravana },
    });

    if (existe) {
      return NextResponse.json({ error: "La caravana ya existe" }, { status: 400 });
    }

    const animal = await prisma.animal.create({
      data: {
        caravana,
        tipo,
        categoria: tipo === "vaca" ? categoria || "seca" : null,
        estado,
        fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : null,
        observaciones: observaciones || null,
      },
    });

    return NextResponse.json(animal, { status: 201 });
  } catch (error) {
    console.error("POST /api/animales:", error);
    return NextResponse.json({ error: "Error al crear animal" }, { status: 500 });
  }
}
