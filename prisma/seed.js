import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  // To be implemented – (1) need to create seed records, and (2) seed scripts
  // @see: https://www.prisma.io/docs/guides/migrate/seed-database
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
