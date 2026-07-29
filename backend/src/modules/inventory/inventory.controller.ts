import type { Request, Response } from 'express';
import * as inventoryService from './inventory.service.js';
import { restockSchema } from './inventory.schema.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';

export const restockVehicle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { quantity } = restockSchema.parse(req.body);

  const updatedVehicle = await inventoryService.restock(id, quantity);

  res.status(200).json(updatedVehicle);
});
