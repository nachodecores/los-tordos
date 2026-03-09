const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

function parseDate(str) {
  if (!str) return null;
  str = str.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return new Date(str);
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) {
    const [, d, month, y] = m;
    const year = y.length === 2 ? 2000 + parseInt(y, 10) : parseInt(y, 10);
    return new Date(year, parseInt(month, 10) - 1, parseInt(d, 10));
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

async function main() {
  const filePath = path.join(__dirname, "tactos.csv");
  if (!fs.existsSync(filePath)) {
    console.error("Crear prisma/tactos.csv con columnas: caravana,fecha,resultado,fecha_estimada_parto");
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n");
  const header = lines[0].split(",").map((c) => c.trim());
  const rows = lines.slice(1).filter((l) => l.trim());
  let inserted = 0;
  for (const line of rows) {
    const values = line.split(",").map((v) => v?.trim() || null);
    const row = {};
    header.forEach((col, i) => {
      row[col] = values[i] || null;
    });
    const { caravana, fecha, resultado, fecha_estimada_parto } = row;
    if (!caravana || !fecha || !resultado) continue;
    const fechaDate = parseDate(fecha);
    const fechaPartoDate = fecha_estimada_parto ? parseDate(fecha_estimada_parto) : null;
    if (!fechaDate) {
      console.warn(`  ${caravana} fecha inválida "${fecha}", salteando`);
      continue;
    }
    if (!["prenada", "vacia"].includes(resultado.toLowerCase())) {
      console.warn(`  ${caravana} ${fecha}: resultado debe ser prenada o vacia`);
      continue;
    }
    const animal = await prisma.animal.findUnique({ where: { caravana } });
    if (!animal) {
      console.warn(`  ${caravana} no existe, salteando`);
      continue;
    }
    await prisma.tacto.create({
      data: {
        animal_id: animal.id,
        fecha: fechaDate,
        resultado: resultado.toLowerCase(),
        fecha_estimada_parto: fechaPartoDate,
      },
    });
    inserted++;
    console.log(`  ${caravana} ${fecha} ${resultado} ok`);
  }
  console.log(`\nListo: ${inserted} tactos importados.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
