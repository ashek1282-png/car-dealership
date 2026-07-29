import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { prisma } from '../../shared/prisma/index.js';

describe('Vehicle Module', () => {
  let userToken: string;
  let adminToken: string;
  let vehicleId: string;

  beforeAll(async () => {
    //Setup Regular User
    await request(app).post('/api/auth/register').send({
      name: 'Normal User', email: 'normal_v2@dealership.com', password: 'password123'
    });
    const userRes = await request(app).post('/api/auth/login').send({
      email: 'normal_v2@dealership.com', password: 'password123'
    });
    userToken = userRes.body.token;

   //Setup Admin User
    await request(app).post('/api/auth/register').send({
      name: 'Admin Boss', email: 'admin_v2@dealership.com', password: 'password123'
    });

    //Promote directly in database
    await prisma.user.update({
      where: { email: 'admin_v2@dealership.com' },
      data: { role: 'ADMIN' },
    });

    const adminRes = await request(app).post('/api/auth/login').send({
      email: 'admin_v2@dealership.com', password: 'password123'
    });
    adminToken = adminRes.body.token;
  });

  describe('POST /api/vehicles', () => {
    it('should return 403 Forbidden if a regular user tries to add a vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ make: 'Ford', model: 'Focus', year: 2022, category: 'Compact', price: 20000 });

      expect(res.status).toBe(403);
    });

    it('should allow an Admin to create a vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ make: 'Nissan', model: 'Altima', year: 2024, category: 'Sedan', price: 25000, quantity: 5 });

      expect(res.status).toBe(201);
      vehicleId = res.body.id; // Save ID for update/delete tests
    });
  });

  describe('GET /api/vehicles', () => {
    it('should allow regular users to view vehicles', async () => {
      const res = await request(app).get('/api/vehicles').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should return 403 Forbidden if a regular user tries to update', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 24000 });
      expect(res.status).toBe(403);
    });

    it('should allow an Admin to update a vehicle', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 24000, quantity: 10 });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(24000);
      expect(res.body.quantity).toBe(10);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should return 403 Forbidden if a regular user tries to delete', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });

    it('should allow an Admin to delete a vehicle', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });
});
