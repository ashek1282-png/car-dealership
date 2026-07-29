import type { Request, Response } from 'express';
import * as vehicleService from './vehicle.service.js';
import { createVehicleSchema } from './vehicle.schema.js';
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
