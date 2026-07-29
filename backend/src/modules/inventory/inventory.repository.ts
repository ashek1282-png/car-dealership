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

export const getVehicleStock = async (id: string) => {
  return await prisma.vehicle.findUnique({
    where: { id },
    select: { quantity: true },
  });
};

export const decrementVehicleStock = async (id: string, quantity: number) => {
  return await prisma.vehicle.update({
    where: { id },
    data: {
      quantity: {
        decrement: quantity,
      },
    },
  });
};
