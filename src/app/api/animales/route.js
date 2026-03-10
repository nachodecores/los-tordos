import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

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
      include: {
        servicios_como_vaca: { orderBy: { fecha: "desc" }, take: 1 },
        tactos: { orderBy: { fecha: "desc" }, take: 1 },
        partos: { orderBy: { fecha: "desc" }, take: 1 },
        secados: { orderBy: { fecha: "desc" }, take: 1 },
        abortos: { orderBy: { fecha: "desc" }, take: 1 },
      },
    });

    const hoy = new Date();
    const DIAS_GESTACION = 283;
    const DIAS_POR_MES = 30.44;

    const animalesConPreñez = animales.map((a) => {
      const uPartoItem = a.partos?.[0];
      let preñez_meses = null;
      if (a.tipo === "toro") {
        preñez_meses = "N/A";
      } else {
        const uServicio = a.servicios_como_vaca?.[0];
        const uTacto = a.tactos?.[0];
        const uAborto = a.abortos?.[0];
        const dS = uServicio ? new Date(uServicio.fecha).getTime() : 0;
        const dT = uTacto ? new Date(uTacto.fecha).getTime() : 0;
        const lastEnd = Math.max(
          uPartoItem ? new Date(uPartoItem.fecha).getTime() : 0,
          uAborto ? new Date(uAborto.fecha).getTime() : 0
        );

        if (dS > lastEnd || dT > lastEnd) {
          if (dT >= dS && uTacto?.resultado === "prenada" && uTacto?.fecha_estimada_parto) {
            const fechaParto = new Date(uTacto.fecha_estimada_parto);
            const diasHastaParto = (fechaParto - hoy) / (24 * 60 * 60 * 1000);
            const diasTranscurridos = DIAS_GESTACION - diasHastaParto;
            const meses = Math.max(0, Math.min(diasTranscurridos / DIAS_POR_MES, 9.5));
            preñez_meses = meses.toFixed(1);
          } else if (uTacto?.resultado === "vacia" && dT >= dS) {
            preñez_meses = null;
          } else if (dS > lastEnd && uServicio) {
            const diasDesdeServicio = (hoy - new Date(uServicio.fecha)) / (24 * 60 * 60 * 1000);
            const meses = Math.max(0, Math.min(diasDesdeServicio / DIAS_POR_MES, 9.5));
            preñez_meses = meses.toFixed(1);
          }
        }
      }
      const uSecado = a.secados?.[0];
      const dias_desde_parto = uPartoItem && a.categoria === "en_ordene"
        ? Math.floor((hoy - new Date(uPartoItem.fecha)) / (24 * 60 * 60 * 1000))
        : null;
      const dias_desde_secado = uSecado && a.categoria === "seca"
        ? Math.floor((hoy - new Date(uSecado.fecha)) / (24 * 60 * 60 * 1000))
        : null;
      const { tactos, servicios_como_vaca, partos, secados, abortos, ...resto } = a;
      return { ...resto, preñez_meses, dias_desde_parto, dias_desde_secado };
    });

    return NextResponse.json(animalesConPreñez);
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
    const creadoPor = await getSessionUser();

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
        creado_por: creadoPor,
      },
    });

    return NextResponse.json(animal, { status: 201 });
  } catch (error) {
    console.error("POST /api/animales:", error);
    return NextResponse.json({ error: "Error al crear animal" }, { status: 500 });
  }
}
