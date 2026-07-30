import 'dotenv/config';
import { seedDatabase } from '../src/shared/seed/seedDatabase.js';
import { prisma } from '../src/shared/prisma/index.js';

seedDatabase()
  .catch((error) => {
    console.error('[seed] Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
