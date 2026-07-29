import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Auth Module - POST /api/auth/register', () => {
  it('should register a new user successfully and return 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test User');
    expect(res.body.email).toBe('test@example.com');
    expect(res.body).not.toHaveProperty('password');
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'incomplete@example.com',
      });

    expect(res.status).toBe(400);
  });
});
