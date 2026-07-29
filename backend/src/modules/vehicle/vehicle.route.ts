import { Router } from 'express';
import { createVehicle } from './vehicle.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', createVehicle);

export default router;
