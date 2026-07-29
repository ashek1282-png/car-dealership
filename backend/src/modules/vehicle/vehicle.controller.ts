import type { Request, Response } from 'express';
import * as vehicleService from './vehicle.service.js';
import { createVehicleSchema, searchVehicleSchema, updateVehicleSchema } from './vehicle.schema.js';
import { ZodError } from 'zod';

export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createVehicleSchema.parse(req.body);
    const vehicle = await vehicleService.addVehicle(validatedData);

    res.status(201).json(vehicle);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.message});
      return;
    }

    console.error("Vehicle Creation Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Get All Vehicles Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = searchVehicleSchema.parse(req.query);
    const vehicles = await vehicleService.searchVehicles(filters);

    res.status(200).json(vehicles);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.message});
      return;
    }
    console.error("Search Vehicles Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = updateVehicleSchema.parse(req.body);
    const id = req.params.id as string;
    const vehicle = await vehicleService.modifyVehicle(id, validatedData);

    res.status(200).json(vehicle);
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.message});
      return;
    }
    console.error("Update Vehicle Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
     const id = req.params.id as string;
    await vehicleService.removeVehicle(id);
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error("Delete Vehicle Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
