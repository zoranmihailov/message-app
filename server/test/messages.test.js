import request from 'supertest';
import { app, prisma } from '../src/app.js';
import { resetDatabase, createTestUser } from './helpers.js';

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /api/chats/:chatId/messages', () => {
  test('успешно испраќа порака кога си член на чатот', async () => {
    const otherUser = await createTestUser({ username: 'jane', email: 'jane@example.com' });

    const registerRes = await request(app).post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko',
    });
    const token = registerRes.body.token;

    const chatRes = await request(app)
      .post('/api/chats')
      .set('Authorization', `Bearer ${token}`)
      .send({
        profileIds: [otherUser.id],
      });
    const chatId = chatRes.body.id;

    const res = await request(app)
      .post(`/api/chats/${chatId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Здраво!',
      });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Здраво!');
    expect(res.body.senderId).toBeDefined();
  });

  test('враќа 400 за празна порака', async () => {
    const otherUser = await createTestUser({ username: 'jane', email: 'jane@example.com' });

    const registerRes = await request(app).post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko',
    });
    const token = registerRes.body.token;

    const chatRes = await request(app)
      .post('/api/chats')
      .set('Authorization', `Bearer ${token}`)
      .send({
        profileIds: [otherUser.id],
      });

    const res = await request(app)
      .post(`/api/chats/${chatRes.body.id}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '   ',
      });

    expect(res.status).toBe(400);
  });

  test('враќа 404 за непостоечки chatId', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko',
    });
    const token = registerRes.body.token;

    const res = await request(app)
      .post('/api/chats/ne-postoi-id/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Здраво!',
      });

    expect(res.status).toBe(404);
  });

  test('враќа 403 ако не си член на чатот (безбедносна проверка)', async () => {
    const jane = await createTestUser({ username: 'jane', email: 'jane@example.com' });

    const markoRegisterRes = await request(app).post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko',
    });
    const markoToken = markoRegisterRes.body.token;

    const chatRes = await request(app)
      .post('/api/chats')
      .set('Authorization', `Bearer ${markoToken}`)
      .send({
        profileIds: [jane.id],
      });
    const chatId = chatRes.body.id;

    const stefanRegisterRes = await request(app).post('/api/auth/register').send({
      username: 'stefan',
      email: 'stefan@example.com',
      password: 'password123',
      name: 'Stefan',
    });
    const stefanToken = stefanRegisterRes.body.token;

    const res = await request(app)
      .post(`/api/chats/${chatId}/messages`)
      .set('Authorization', `Bearer ${stefanToken}`)
      .send({
        content: 'Не треба да можам ова!',
      });

    expect(res.status).toBe(403);
  });

  test('враќа 401 ако воопшто не си најавен', async () => {
    const otherUser = await createTestUser({ username: 'jane', email: 'jane@example.com' });

    const registerRes = await request(app).post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko',
    });
    const token = registerRes.body.token;

    const chatRes = await request(app)
      .post('/api/chats')
      .set('Authorization', `Bearer ${token}`)
      .send({
        profileIds: [otherUser.id],
      });

    const res = await request(app).post(`/api/chats/${chatRes.body.id}/messages`).send({
      content: 'Здраво!',
    });

    expect(res.status).toBe(401);
  });
});