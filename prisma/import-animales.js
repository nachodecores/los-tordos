const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const fileName = process.argv[2] || "migracion.csv";
  const filePath = path.join(__dirname, fileName);
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n");

  const header = lines[0].split(",");
  const rows = lines.slice(1).filter((line) => line.trim());

  let inserted = 0;
  let skipped = 0;

  for (const line of rows) {
    const values = line.split(",");
    const row = {};
    header.forEach((col, i) => {
      row[col.trim()] = values[i]?.trim() || null;
    });

    const caravana = row.caravana;
    if (!caravana) continue;

    const fechaNacimiento = row.fecha_nacimiento
      ? new Date(row.fecha_nacimiento)
      : null;

    try {
      await prisma.animal.upsert({
        where: { caravana },
        create: {
          caravana,
          tipo: row.tipo || "vaca",
          categoria: row.categoria || null,
          estado: row.estado || "activo",
          fecha_nacimiento: fechaNacimiento,
          observaciones: row.observaciones || null,
        },
        update: {
          tipo: row.tipo || "vaca",
          categoria: row.categoria || null,
          estado: row.estado || "activo",
          fecha_nacimiento: fechaNacimiento,
          observaciones: row.observaciones || null,
        },
      });
      inserted++;
      console.log(`  ${caravana} ok`);
    } catch (err) {
      console.error(`  ${caravana} error:`, err.message);
      skipped++;
    }
  }

  console.log(`\nListo: ${inserted} animales importados${skipped ? `, ${skipped} errores` : ""}.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
