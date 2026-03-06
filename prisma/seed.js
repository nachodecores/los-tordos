const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = "tambo2025"; // Cambiar después del primer login

  const usuarios = [
    { nombre: "Chacho", rol: "admin" },
    { nombre: "Nacho", rol: "admin" },
    { nombre: "Lucas", rol: "operador" },
  ];

  for (const u of usuarios) {
    const hash = await bcrypt.hash(defaultPassword, 10);
    await prisma.usuario.upsert({
      where: { nombre: u.nombre },
      create: { nombre: u.nombre, password_hash: hash, rol: u.rol },
      update: {},
    });
    console.log(`Usuario ${u.nombre} (${u.rol}) creado/actualizado`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
