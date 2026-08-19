import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const TIPOS_VALIDOS = ["servicio", "tacto", "parto", "secado", "aborto", "alta_animal"];

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const tipoEvento = searchParams.get("tipo_evento");
    const q = searchParams.get("q");
    const desde = searchParams.get("desde");
    const hasta = searchParams.get("hasta");

    const condiciones = [Prisma.sql`1=1`];

    if (tipoEvento && TIPOS_VALIDOS.includes(tipoEvento)) {
      condiciones.push(Prisma.sql`tipo_evento = ${tipoEvento}`);
    }
    if (q) {
      condiciones.push(Prisma.sql`caravana ILIKE ${`%${q}%`}`);
    }
    if (desde) {
      condiciones.push(Prisma.sql`fecha >= ${desde}::date`);
    }
    if (hasta) {
      condiciones.push(Prisma.sql`fecha <= ${hasta}::date`);
    }

    const where = Prisma.join(condiciones, " AND ");

    const eventos = await prisma.$queryRaw`
      SELECT tipo_evento, evento_id, animal_id, caravana, fecha, creado_por, created_at
      FROM eventos_auditoria
      WHERE ${where}
      ORDER BY created_at DESC
      LIMIT 500
    `;

    return NextResponse.json(eventos);
  } catch (error) {
    console.error("GET /api/auditoria:", error);
    return NextResponse.json(
      { error: "Error al obtener la auditoría" },
      { status: 500 }
    );
  }
}
