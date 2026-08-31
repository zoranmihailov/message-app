import request from "supertest";
import { app, prisma } from "../src/app.js";
import { resetDatabase, createTestUser } from "./helpers.js";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /api/chats", () => {
  test("создава 1-на-1 чат меѓу двајца корисници", async () => {
    const otherUser = await createTestUser({
      username: "stefan",
      email: "stefan@example.com",
    });

    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      username: "marko",
      email: "marko@example.com",
      password: "password123",
      name: "Marko",
    });

    const res = await agent.post("/api/chats").send({
      profileIds: [otherUser.id],
    });

    expect(res.status).toBe(201);
    expect(res.body.isGroup).toBe(false);
    expect(res.body.profiles).toHaveLength(2);
  });

  test("враќа ПОСТОЕЧКИ чат наместо нов, ако веќе постои 1-на-1 разговор меѓу истите луѓе", async () => {
    const otherUser = await createTestUser({
      username: "stefan",
      email: "stefan@example.com",
    });
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      username: "marko",
      email: "marko@example.com",
      password: "password123",
      name: "Marko",
    });

    const firstRes = await agent.post("/api/chats").send({
      profileIds: [otherUser.id],
    });
    const secondRes = await agent.post("/api/chats").send({
      profileIds: [otherUser.id],
    });

    expect(firstRes.status).toBe(201); 
    expect(secondRes.status).toBe(200); 
    expect(firstRes.body.id).toBe(secondRes.body.id);
  });

  test("враќа 400 ако profileIds е празна низа", async () => {

    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      username: "marko",
      email: "marko@example.com",
      password: "password123",
      name: "Marko",
    });

    const res = await agent.post("/api/chats").send({
      profileIds: [],
    });

    expect(res.status).toBe(400);
  });

  test("создава групен чат кога има повеќе од 2 учесници", async () => {
    const firstUser = await createTestUser({
      username: "stefan",
      email: "stefan@example.com",
    });
    const secondUser = await createTestUser({
      username: "jane",
      email: "jane@example.com",
    });

    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      username: "marko",
      email: "marko@example.com",
      password: "password123",
      name: "Marko",
    });

    const res = await agent.post("/api/chats").send({
      profileIds: [firstUser.id, secondUser.id],
      name: "Тест група"
    });

    expect(res.status).toBe(201);
    expect(res.body.isGroup).toBe(true);
    expect(res.body.profiles).toHaveLength(3);
  });

  test("враќа 400 за групен чат без име", async () => {
  const firstUser = await createTestUser({ username: "stefan", email: "stefan@example.com" });
  const secondUser = await createTestUser({ username: "jane", email: "jane@example.com" });

  const agent = request.agent(app);
  await agent.post("/api/auth/register").send({
    username: "marko",
    email: "marko@example.com",
    password: "password123",
    name: "Marko",
  });

  const res = await agent.post("/api/chats").send({
    profileIds: [firstUser.id, secondUser.id],
  });

  expect(res.status).toBe(400);
});
});
