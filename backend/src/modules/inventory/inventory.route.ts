import { Router } from 'express';
import { restockVehicle, purchaseVehicle } from './inventory.controller.js';
import { authenticate, requireAdmin } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/:id/restock', requireAdmin, restockVehicle);
router.post('/:id/purchase', purchaseVehicle);
export default router;
