import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { prisma } from '../../shared/prisma/index.js';

describe('Inventory Module', () => {
  let userToken: string;
  let adminToken: string;
  let vehicleId: string;
  const initialQuantity = 5;

  beforeAll(async () => {
    //Setup Regular User
    await request(app).post('/api/auth/register').send({
      name: 'Inv User',
      email: 'inv_user@dealership.com',
      password: 'password123',
    });
    const userRes = await request(app).post('/api/auth/login').send({
      email: 'inv_user@dealership.com',
      password: 'password123',
    });
    userToken = userRes.body.token;

    //Setup Admin User
    await request(app).post('/api/auth/register').send({
      name: 'Inv Admin',
      email: 'inv_admin@dealership.com',
      password: 'password123',
    });

    await prisma.user.update({
      where: { email: 'inv_admin@dealership.com' },
      data: { role: 'ADMIN' },
    });

    const adminRes = await request(app).post('/api/auth/login').send({
      email: 'inv_admin@dealership.com',
      password: 'password123',
    });
    adminToken = adminRes.body.token;

    //Create a vehicle specifically for our restock tests
    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'Mazda',
        model: 'CX-5',
        year: 2024,
        category: 'SUV',
        price: 30000,
        quantity: initialQuantity,
      });

    vehicleId = vehicleRes.body.id;
  });

  describe('POST /api/inventory/:id/restock', () => {
    it('should return 403 Forbidden if a regular user tries to restock', async () => {
      const res = await request(app)
        .post(`/api/inventory/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(403);
    });

    it('should allow an Admin to restock a vehicle and correctly increment the quantity', async () => {
      const addedQuantity = 10;
      const res = await request(app)
        .post(`/api/inventory/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: addedQuantity });

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(initialQuantity + addedQuantity);
    });
  });

  describe('POST /api/inventory/:id/purchase', () => {
    let purchaseVehicleId: string;
    const stockedQuantity = 3;

    beforeAll(async () => {
      const vehicleRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Toyota',
          model: 'Corolla',
          year: 2023,
          category: 'Sedan',
          price: 22000,
          quantity: stockedQuantity,
        });

      purchaseVehicleId = vehicleRes.body.id;
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app).post(`/api/inventory/${purchaseVehicleId}/purchase`).send({});

      expect(res.status).toBe(401);
    });

    it('should allow a regular user to purchase a vehicle and decrement the quantity by 1 by default', async () => {
      const res = await request(app)
        .post(`/api/inventory/${purchaseVehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(stockedQuantity - 1);
    });

    it('should decrement by the requested quantity when provided', async () => {
      const res = await request(app)
        .post(`/api/inventory/${purchaseVehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(0);
    });

    it('should return 400 when purchasing more than the available stock', async () => {
      const res = await request(app)
        .post(`/api/inventory/${purchaseVehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(400);
    });

    it('should return 404 when the vehicle does not exist', async () => {
      const res = await request(app)
        .post('/api/inventory/00000000-0000-0000-0000-000000000000/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(404);
    });
  });
});
