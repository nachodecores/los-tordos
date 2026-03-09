const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const users = await prisma.usuario.count();
  const animals = await prisma.animal.count();
  const servicios = await prisma.servicio.count();
  console.log('Usuarios:', users);
  console.log('Animales:', animals);
  console.log('Servicios:', servicios);
}
check().finally(() => prisma.$disconnect());
