import type { Request, Response } from 'express';
import * as authService from './auth.service.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';

export const register = catchAsync(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);
  const user = await authService.registerUser(validatedData);

  res.status(201).json(user);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);

  try {
    const result = await authService.loginUser(validatedData);
    res.status(200).json(result);
  } catch (error: any) {
    // Attach the 401 status so the global error handler knows how to format it
    if (error.message === 'INVALID_CREDENTIALS') {
      error.statusCode = 401;
      error.message = 'Invalid email or password';
    }
    // Throw it back for catchAsync to pass to the global handler
    throw error;
  }
});
