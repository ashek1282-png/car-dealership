import { prisma } from '../../shared/prisma/index.js';
import { Prisma } from '../../generated/prisma/client.js';
import type { SearchVehicleInput } from './vehicle.schema.js';

export const createVehicle = async (data: Prisma.VehicleCreateInput) => {
  return await prisma.vehicle.create({
    data,
  });
};

export const getAllVehicles = async () => {
  return await prisma.vehicle.findMany();
};

export const searchVehicles = async (filters: SearchVehicleInput) => {
  const where: Prisma.VehicleWhereInput = {};

  if (filters.make) where.make = { contains: filters.make, mode: 'insensitive' };
  if (filters.model) where.model = { contains: filters.model, mode: 'insensitive' };
  if (filters.category) where.category = { contains: filters.category, mode: 'insensitive' };

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  return await prisma.vehicle.findMany({ where });
};

export const updateVehicle = async (id: string, data: Prisma.VehicleUpdateInput) => {
  return await prisma.vehicle.update({
    where: { id },
    data,
  });
};

export const deleteVehicle = async (id: string) => {
  return await prisma.vehicle.delete({
    where: { id },
  });
};
