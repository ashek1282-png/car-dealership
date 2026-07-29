import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.route.js';

const app = express();

app.use(cors());
app.use(express.json());

// Mount the auth routes
app.use('/api/auth', authRoutes);

export default app;
