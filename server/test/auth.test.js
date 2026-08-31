import request from 'supertest';
import { app, prisma } from '../src/app.js';
import { resetDatabase, createTestUser } from './helpers.js';

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /api/auth/register', () => {
  test('создава нов профил со валидни податоци', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko Markov',
    });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe('marko');

    expect(res.body.password).toBeUndefined();
  });

  test('враќа 400 ако недостасува поле', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
    });

    expect(res.status).toBe(400);
  });

  test('враќа 400 за кратка лозинка', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: '123',
      name: 'Marko',
    });

    expect(res.status).toBe(400);
  });

  test('враќа 409 ако username веќе постои', async () => {
    await createTestUser({ username: 'marko', email: 'first@example.com' });

    const res = await request(app).post('/api/auth/register').send({
      username: 'marko', 
      email: 'second@example.com', 
      password: 'password123',
      name: 'Marko',
    });

    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  test('успешно логирање со точни податоци', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko',
    });

    const res = await request(app).post('/api/auth/login').send({
      username: 'marko',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('marko');
  });

  test('враќа 401 за погрешна лозинка', async () => {
    await createTestUser({ username: 'marko' });

    const res = await request(app).post('/api/auth/login').send({
      username: 'marko',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
  });

  test('враќа 401 за непостоечки username (не 404!)', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'nepostoi',
      password: 'password123',
    });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  test('враќа 401 ако не си најавен', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('враќа профил ако си најавен (со token)', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko',
    });

    const token = registerRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('marko');
  });
});