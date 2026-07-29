import { prisma } from '../../shared/prisma/index.js';
import { Prisma } from '../../generated/prisma/client.js';

export const createVehicle = async (data: Prisma.VehicleCreateInput) => {
  return await prisma.vehicle.create({
    data,
  });
};
