import type { Request, Response } from 'express';
import * as authService from './auth.service.js';
import { registerSchema } from './auth.schema.js';
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
