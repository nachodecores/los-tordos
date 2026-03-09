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
  const fileName = process.argv[2] || "servicios.csv";
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) {
    console.error("Crear prisma/servicios.csv con columnas: caravana_vaca,fecha");
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
    const { caravana_vaca, fecha } = row;
    if (!caravana_vaca || !fecha) continue;
    const fechaDate = parseDate(fecha);
    if (!fechaDate) {
      console.warn(`  ${caravana_vaca} fecha inválida "${fecha}", salteando`);
      continue;
    }
    const vaca = await prisma.animal.findUnique({ where: { caravana: caravana_vaca } });
    if (!vaca) {
      console.warn(`  ${caravana_vaca} no existe, salteando`);
      continue;
    }
    await prisma.servicio.create({
      data: {
        animal_id: vaca.id,
        fecha: fechaDate,
      },
    });
    inserted++;
    console.log(`  ${caravana_vaca} ${fecha} ok`);
  }
  console.log(`\nListo: ${inserted} servicios importados.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
