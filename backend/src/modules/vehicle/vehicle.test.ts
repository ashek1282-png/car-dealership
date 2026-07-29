import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Vehicle Module', () => {
  let token: string;

  // We need a valid JWT token before we can test protected routes
  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Admin User',
      email: 'admin@dealership.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@dealership.com',
      password: 'password123',
    });

    token = res.body.token;
  });

  describe('POST /api/vehicles', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .send({
          make: 'Toyota',
          model: 'Camry',
          year: 2024,
          category: 'Sedan',
          price: 25000,
          quantity: 10,
        });

      expect(res.status).toBe(401);
    });

    it('should create a new vehicle and return 201 when authenticated', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send({
          make: 'Honda',
          model: 'Civic',
          year: 2024,
          category: 'Sedan',
          price: 26000,
          quantity: 5,
          description: 'A reliable compact car',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.make).toBe('Honda');
      expect(res.body.quantity).toBe(5);
    });
  });

  describe('GET /api/vehicles', () => {
      it('should return 401 if not authenticated', async () => {
        const res = await request(app).get('/api/vehicles');
        expect(res.status).toBe(401);
      });

      it('should return a list of vehicles when authenticated', async () => {
        const res = await request(app)
          .get('/api/vehicles')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        // We created one vehicle in the previous POST test
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      });
    });

    describe('GET /api/vehicles/search', () => {
      it('should filter vehicles by make', async () => {
        const res = await request(app)
          .get('/api/vehicles/search?make=Honda')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].make).toBe('Honda');
      });

      it('should return an empty array if no vehicles match the search', async () => {
        const res = await request(app)
          .get('/api/vehicles/search?make=Ferrari')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
      });
    });
});
