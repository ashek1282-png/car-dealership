import type { Request, Response } from 'express';
import * as authService from './auth.service.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { ZodError } from 'zod';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate incoming data
    const validatedData = registerSchema.parse(req.body);

    //Call service layer
    const user = await authService.registerUser(validatedData);

    //Return 201 Created
    res.status(201).json(user);
  } catch (error) {
    //Handle Zod validation errors (returns 400)
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.message});
      return;
    }

     console.error(error);
    //Basic fallback for now, we will add a global error handler later
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await authService.loginUser(validatedData);

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.message});
      return;
    }

    if (error.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    console.error("Login Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
