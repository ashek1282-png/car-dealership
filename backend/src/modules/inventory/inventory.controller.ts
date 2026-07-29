import type { Request, Response } from 'express';
import * as inventoryService from './inventory.service.js';
import { restockSchema } from './inventory.schema.js';
import { ZodError } from 'zod';

export const restockVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { quantity } = restockSchema.parse(req.body);

    const updatedVehicle = await inventoryService.restock(id, quantity);

    res.status(200).json(updatedVehicle);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.message});
      return;
    }

    console.error("Restock Vehicle Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
