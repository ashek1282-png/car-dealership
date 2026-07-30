import type { Request, Response } from 'express';
import * as inventoryService from './inventory.service.js';
import { restockSchema, purchaseSchema } from './inventory.schema.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';

export const restockVehicle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { quantity } = restockSchema.parse(req.body);

  const updatedVehicle = await inventoryService.restock(id, quantity);

  res.status(200).json(updatedVehicle);
});

export const purchaseVehicle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { quantity } = purchaseSchema.parse(req.body ?? {});

  const updatedVehicle = await inventoryService.purchase(id, quantity);

  res.status(200).json(updatedVehicle);
});
