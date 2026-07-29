import type { Request, Response } from 'express';
import * as vehicleService from './vehicle.service.js';
import { createVehicleSchema, searchVehicleSchema, updateVehicleSchema } from './vehicle.schema.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';

export const createVehicle = catchAsync(async (req: Request, res: Response) => {
  const validatedData = createVehicleSchema.parse(req.body);
  const vehicle = await vehicleService.addVehicle(validatedData);

  res.status(201).json(vehicle);
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const vehicles = await vehicleService.getAllVehicles();
  res.status(200).json(vehicles);
});

export const search = catchAsync(async (req: Request, res: Response) => {
  const filters = searchVehicleSchema.parse(req.query);
  const vehicles = await vehicleService.searchVehicles(filters);

  res.status(200).json(vehicles);
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const validatedData = updateVehicleSchema.parse(req.body);
  const id = req.params.id as string;
  const vehicle = await vehicleService.modifyVehicle(id, validatedData);

  res.status(200).json(vehicle);
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await vehicleService.removeVehicle(id);

  res.status(200).json({ message: 'Vehicle deleted successfully' });
});
