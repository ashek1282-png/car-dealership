import bcrypt from 'bcrypt';
import { prisma } from '../prisma/index.js';
import { vehicleSeedData } from './vehicleSeedData.js';
import type { Role } from '../../generated/prisma/client.js';

const ADMIN_EMAIL = 'admin@autoledger.com';
const ADMIN_PASSWORD = 'Admin@123';
const DEMO_EMAIL = 'user@autoledger.com';
const DEMO_PASSWORD = 'User@123';

const seedAccount = async (email: string, password: string, name: string, role: Role) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`[seed] ${role} account already exists (${email}), skipping.`);
    return;
  }

  await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 10), role },
  });
  console.log(`[seed] Created ${role.toLowerCase()} account -> ${email} / ${password}`);
};

export const seedDatabase = async () => {
  await seedAccount(ADMIN_EMAIL, ADMIN_PASSWORD, 'Dana Admin', 'ADMIN');
  await seedAccount(DEMO_EMAIL, DEMO_PASSWORD, 'Jordan Buyer', 'USER');

  const vehicleCount = await prisma.vehicle.count();
  if (vehicleCount > 0) {
    console.log(`[seed] Vehicles table already has ${vehicleCount} row(s), skipping vehicle seed.`);
    return;
  }

  await prisma.vehicle.createMany({ data: vehicleSeedData });
  console.log(`[seed] Inserted ${vehicleSeedData.length} demo vehicles.`);
};
