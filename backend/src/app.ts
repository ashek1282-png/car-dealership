import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.route.js';
import vehicleRoutes from './modules/vehicle/vehicle.route.js'

const app = express();

app.use(cors());
app.use(express.json());

// Mount the auth routes
app.use('/api/auth', authRoutes);

//Mount the vehicle routes
app.use('/api/vehicles', vehicleRoutes);

export default app;
