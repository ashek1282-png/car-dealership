import * as vehicleRepository from './vehicle.repository.js';
import type { CreateVehicleInput, SearchVehicleInput, UpdateVehicleInput } from './vehicle.schema.js';

export const addVehicle = async (data: CreateVehicleInput) => {
  return await vehicleRepository.createVehicle({
    ...data,
    description: data.description ?? null,
    imageUrl: data.imageUrl ?? null,
  });
};

export const getAllVehicles = async () => {
  return await vehicleRepository.getAllVehicles();
};

export const searchVehicles = async (filters: SearchVehicleInput) => {
  return await vehicleRepository.searchVehicles(filters);
};

export const modifyVehicle = async (id: string, data: UpdateVehicleInput) => {
  const updateData: any = {
    ...data,
  };

  if (data.description !== undefined)
    updateData.description = data.description ?? null;

  if (data.imageUrl !== undefined)
    updateData.imageUrl = data.imageUrl ?? null;

  return await vehicleRepository.updateVehicle(id, updateData);
};

export const removeVehicle = async (id: string) => {
  return await vehicleRepository.deleteVehicle(id);
};
