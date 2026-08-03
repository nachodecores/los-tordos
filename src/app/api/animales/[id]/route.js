import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        servicios_como_vaca: { orderBy: { fecha: 'desc' } },
        tactos: { orderBy: { fecha: 'desc' } },
        partos: { orderBy: { fecha: 'desc' } },
        secados: { orderBy: { fecha: 'desc' } },
        abortos: { orderBy: { fecha: 'desc' } },
      },
    });
    if (!animal) {
      return NextResponse.json({ error: "Animal no encontrado" }, { status: 404 });
    }

    const hoy = new Date();
    const DIAS_GESTACION = 283;
    const DIAS_POR_MES = 30.44;
    const uPartoItem = animal.partos?.[0];
    let preñez_meses = null;
    if (animal.tipo === "toro") {
      preñez_meses = "N/A";
    } else {
      const uServicio = animal.servicios_como_vaca?.[0];
      const uTacto = animal.tactos?.[0];
      const uAborto = animal.abortos?.[0];
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

    const { tactos, servicios_como_vaca, partos, abortos, ...resto } = animal;
    return NextResponse.json({ ...resto, tactos, servicios_como_vaca, partos, abortos, preñez_meses });
  } catch (error) {
    console.error("GET /api/animales/[id]:", error);
    return NextResponse.json(
      { error: "Error al buscar animal" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { caravana, tipo, categoria, estado, fecha_nacimiento, observaciones } = await request.json();
    const actualizadoPor = await getSessionUser();

    const animal = await prisma.animal.update({
      where: { id },
      data: {
        caravana,
        tipo,
        categoria: tipo === "vaca" ? categoria || "seca" : tipo === "vaquillona" ? "vaquillona" : null,
        estado,
        fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : null,
        observaciones: observaciones || null,
        actualizado_por: actualizadoPor,
      },
    });

    return NextResponse.json(animal);
  } catch (error) {
    console.error("PUT /api/animales/[id]:", error);
    return NextResponse.json({ error: "Error al actualizar animal" }, { status: 500 });
  }
}
