import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../../generated/prisma/client.js'; // Or your standard Prisma import path

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(`[Error] ${req.method} ${req.url} >>`, err.message || err);

  //Handle Zod Validation Errors
  if (err instanceof ZodError) {
    res.status(400).json({ errors: err.message });
    return;
  }

  //Handle known Prisma Errors (e.g., Record not found)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Record not found in database' });
      return;
    }
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'A unique constraint would be violated' });
      return;
    }
  }

  //Fallback for everything else
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ error: message });
};
