import { Router } from 'express';
import { createVehicle, getAll, search } from './vehicle.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/search', search);
router.get('/', getAll);
router.post('/', createVehicle);

export default router;
