import { Router } from 'express';
import { createVehicle, getAll, search, update, remove } from './vehicle.controller.js';
import { authenticate, requireAdmin } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/search', search);
router.get('/', getAll);

router.post('/', requireAdmin, createVehicle);
router.put('/:id', requireAdmin, update);
router.delete('/:id', requireAdmin, remove);

export default router;
