import { Router } from 'express';
import { restockVehicle } from './inventory.controller.js';
import { authenticate, requireAdmin } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/:id/restock', requireAdmin, restockVehicle);

export default router;
