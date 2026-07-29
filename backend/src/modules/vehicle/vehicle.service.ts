import * as vehicleRepository from './vehicle.repository.js';
import type { CreateVehicleInput } from './vehicle.schema.js';

export const addVehicle = async (data: CreateVehicleInput) => {
  return await vehicleRepository.createVehicle({
    ...data,
    description: data.description ?? null,
    imageUrl: data.imageUrl ?? null,
  });
};
