import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const hoy = new Date();
    // Primer día del mes actual
    const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    // 1. Obtener todas las vacas y vaquillonas activas con su último evento de cada tipo
    const animales = await prisma.animal.findMany({
      where: { 
        estado: "activo", 
        tipo: { in: ["vaca", "vaquillona"] } 
      },
      include: {
        servicios_como_vaca: { orderBy: { fecha: 'desc' }, take: 1 },
        tactos: { orderBy: { fecha: 'desc' }, take: 1 },
        partos: { orderBy: { fecha: 'desc' }, take: 1 },
        abortos: { orderBy: { fecha: 'desc' }, take: 1 },
      }
    });

    let vacasEnOrdene = 0;
    let vacasSecas = 0;
    let vaquillonas = 0;
    const partosProyectados = [];

    // 2. Procesar cada animal para calcular estado y fecha de parto
    animales.forEach(animal => {
      // Conteo actual
      if (animal.tipo === "vaca") {
        if (animal.categoria === "en_ordene") vacasEnOrdene++;
        if (animal.categoria === "seca") vacasSecas++;
      } else if (animal.tipo === "vaquillona") {
        vaquillonas++;
      }

      // Obtener el evento más reciente de cada tipo
      const uServicio = animal.servicios_como_vaca[0];
      const uTacto = animal.tactos[0];
      const uParto = animal.partos[0];
      const uAborto = animal.abortos[0];

      const dS = uServicio ? new Date(uServicio.fecha).getTime() : 0;
      const dT = uTacto ? new Date(uTacto.fecha).getTime() : 0;
      const dP = uParto ? new Date(uParto.fecha).getTime() : 0;
      const dA = uAborto ? new Date(uAborto.fecha).getTime() : 0;

      // lastEnd es la fecha donde terminó cualquier preñez anterior
      const lastEnd = Math.max(dP, dA);
      animal._lastLactationStart = lastEnd > 0 ? new Date(lastEnd) : null;

      let fechaParto = null;

      // Si hubo un servicio o tacto DESPUÉS del último parto/aborto
      if (dT > lastEnd || dS > lastEnd) {
        // Si el tacto es el evento más reciente (o en el mismo día que el servicio)
        if (dT >= dS) {
          if (uTacto.resultado === "prenada" && uTacto.fecha_estimada_parto) {
            fechaParto = new Date(uTacto.fecha_estimada_parto);
          }
        } else {
          // Si el servicio es el más reciente (aún no hay tacto que lo confirme o niegue)
          // Se asume una preñez potencial de 283 días
          fechaParto = new Date(uServicio.fecha);
          fechaParto.setDate(fechaParto.getDate() + 283);
        }
      }

      // Si la vaca está (potencial o confirmada) preñada, la sumamos a la proyección
      if (fechaParto && fechaParto >= inicioMesActual) {
        partosProyectados.push({
          animal,
          fechaParto
        });
      }
    });

    // 3. Generar la estructura de 12 meses
    const proyeccion = [];

    for (let i = 0; i < 12; i++) {
      // Tomamos el último día del mes como punto de referencia para calcular si la vaca estará en ordeñe
      const finDeMes = new Date(hoy.getFullYear(), hoy.getMonth() + i + 1, 0);
      const labelMes = finDeMes.toLocaleDateString("es-AR", { month: "short", year: "2-digit" });
      
      proyeccion.push({
        mes: labelMes,
        year: finDeMes.getFullYear(),
        monthIndex: finDeMes.getMonth(), // 0-11
        finDeMes: finDeMes,
        partosEsperados: 0,
        secadosEsperados: 0,
        vacasEnOrdeneProyectadas: 0,
      });
    }

    // 4. Ubicar los partos y calcular estado absoluto de vacas en ordeñe por mes
    partosProyectados.forEach((proy) => {
      const fechaParto = proy.fechaParto;
      
      // Regla de negocio: secado recomendado 45 días antes del parto
      const fechaSecado = new Date(fechaParto);
      fechaSecado.setDate(fechaSecado.getDate() - 45);

      // Sumar parto esperado en el mes correspondiente
      const proyParto = proyeccion.find(p => p.year === fechaParto.getFullYear() && p.monthIndex === fechaParto.getMonth());
      if (proyParto) {
        proyParto.partosEsperados += 1;
      }

      // Sumar secado esperado (solo para vacas, las vaquillonas no se secan)
      if (proy.animal.tipo === "vaca") {
        const proySecado = proyeccion.find(p => p.year === fechaSecado.getFullYear() && p.monthIndex === fechaSecado.getMonth());
        if (proySecado) {
          proySecado.secadosEsperados += 1;
        }
      }
    });

    // 5. Calcular cuántas vacas hay en ordeñe en cada mes (análisis animal por animal)
    proyeccion.forEach((mes) => {
      let enOrdeneEsteMes = 0;

      animales.forEach(animal => {
        // Estado inicial
        let isMilking = animal.tipo === "vaca" && animal.categoria === "en_ordene";

        // Si el animal tiene un parto proyectado, evaluamos su curva
        const proy = partosProyectados.find(p => p.animal.id === animal.id);
        if (proy) {
          const fechaParto = proy.fechaParto;
          const fechaSecado = new Date(fechaParto);
          fechaSecado.setDate(fechaSecado.getDate() - 45); // -45 días

          // ¿En qué estado estará este animal a fin de este mes?
          if (mes.finDeMes >= fechaParto) {
            // Ya parió -> entra a ordeñe
            isMilking = true;
          } else if (mes.finDeMes >= fechaSecado) {
            // Pasó la fecha de secado pero aún no parió -> está seca
            isMilking = false;
          }
          // Si no cumple ninguna, mantiene su estado inicial (ej. sigue en ordeñe hasta que toque secarla)
        }

        // Regla: si lleva más de 24 meses de lactancia, se sugiere secado
        if (isMilking) {
          let currentLactationStart = animal._lastLactationStart;
          
          if (proy && mes.finDeMes >= proy.fechaParto) {
            currentLactationStart = proy.fechaParto;
          }

          if (currentLactationStart) {
            const monthsInMilk = (mes.finDeMes.getFullYear() - currentLactationStart.getFullYear()) * 12 + (mes.finDeMes.getMonth() - currentLactationStart.getMonth());
            if (monthsInMilk >= 24) {
              isMilking = false;
            }
          }
        }

        if (isMilking) {
          enOrdeneEsteMes++;
        }
      });

      mes.vacasEnOrdeneProyectadas = enOrdeneEsteMes;
      // Quitamos finDeMes para no ensuciar el JSON de respuesta
      delete mes.finDeMes;
    });

    return NextResponse.json({
      actual: {
        vacasEnOrdene,
        vacasSecas,
        vaquillonas,
        totalActivos: vacasEnOrdene + vacasSecas + vaquillonas
      },
      proyeccion
    });

  } catch (error) {
    console.error("GET /api/informes/proyecciones:", error);
    return NextResponse.json(
      { error: "Error al generar proyecciones" },
      { status: 500 }
    );
  }
}
