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
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko',
    });

    const chatRes = await agent.post('/api/chats').send({
      profileIds: [otherUser.id],
    });
    const chatId = chatRes.body.id;

    const res = await agent.post(`/api/chats/${chatId}/messages`).send({
      content: 'Здраво!',
    });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Здраво!');
    expect(res.body.senderId).toBeDefined();
  });

  test('враќа 400 за празна порака', async () => {
    const otherUser = await createTestUser({ username: 'jane', email: 'jane@example.com' });
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko',
    });

    const chatRes = await agent.post('/api/chats').send({
      profileIds: [otherUser.id],
    });

    const res = await agent.post(`/api/chats/${chatRes.body.id}/messages`).send({
      content: '   ', 
    });

    expect(res.status).toBe(400);
  });

  test('враќа 404 за непостоечки chatId', async () => {
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko',
    });

    const res = await agent.post('/api/chats/ne-postoi-id/messages').send({
      content: 'Здраво!',
    });

    expect(res.status).toBe(404);
  });

  test('враќа 403 ако не си член на чатот (безбедносна проверка)', async () => {
    const jane = await createTestUser({ username: 'jane', email: 'jane@example.com' });
    const markoAgent = request.agent(app);

    await markoAgent.post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko',
    });

    const chatRes = await markoAgent.post('/api/chats').send({
      profileIds: [jane.id],
    });
    const chatId = chatRes.body.id;

    const stefanAgent = request.agent(app);
    await stefanAgent.post('/api/auth/register').send({
      username: 'stefan',
      email: 'stefan@example.com',
      password: 'password123',
      name: 'Stefan',
    });

    const res = await stefanAgent.post(`/api/chats/${chatId}/messages`).send({
      content: 'Не треба да можам ова!',
    });

    expect(res.status).toBe(403);
  });

  test('враќа 401 ако воопшто не си најавен', async () => {
    const otherUser = await createTestUser({ username: 'jane', email: 'jane@example.com' });
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
      username: 'marko',
      email: 'marko@example.com',
      password: 'password123',
      name: 'Marko',
    });

    const chatRes = await agent.post('/api/chats').send({
      profileIds: [otherUser.id],
    });

    const res = await request(app).post(`/api/chats/${chatRes.body.id}/messages`).send({
      content: 'Здраво!',
    });

    expect(res.status).toBe(401);
  });
});