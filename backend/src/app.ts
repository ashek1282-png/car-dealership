import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.route.js';
import vehicleRoutes from './modules/vehicle/vehicle.route.js';
import inventoryRoutes from './modules/inventory/inventory.route.js';
import { globalErrorHandler } from './shared/middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Mount the auth routes
app.use('/api/auth', authRoutes);

//Mount the vehicle routes
app.use('/api/vehicles', vehicleRoutes);

//Mount the inventory routes
app.use('/api/inventory', inventoryRoutes);

//Mount Global error handler
app.use(globalErrorHandler);
export default app;
