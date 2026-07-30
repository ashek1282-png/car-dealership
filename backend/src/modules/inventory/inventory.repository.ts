import { prisma } from '../../shared/prisma/index.js';

export const restockVehicle = async (id: string, quantity: number) => {
  return await prisma.vehicle.update({
    where: { id },
    data: {
      quantity: {
        increment: quantity,
      },
    },
  });
};

export const findVehicleById = async (id: string) => {
  return await prisma.vehicle.findUnique({
    where: { id },
  });
};

export const purchaseVehicle = async (id: string, quantity: number) => {
  return await prisma.vehicle.update({
    where: { id },
    data: {
      quantity: {
        decrement: quantity,
      },
    },
  });
};
