import { z } from 'zod';

export const restockSchema = z.object({
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export const purchaseSchema = z.object({
  quantity: z.number().int().positive('Quantity must be a positive integer').default(1),
});
