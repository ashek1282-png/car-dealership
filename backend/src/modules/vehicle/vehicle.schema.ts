import { z } from 'zod';

export const createVehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1886, 'Invalid year'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().nonnegative('Quantity cannot be negative').default(0),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
