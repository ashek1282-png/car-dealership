import * as vehicleRepository from './vehicle.repository.js';
import type { CreateVehicleInput, SearchVehicleInput } from './vehicle.schema.js';

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
