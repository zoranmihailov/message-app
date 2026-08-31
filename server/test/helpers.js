import { prisma } from '../src/app.js';
import bcrypt from 'bcrypt';

export async function resetDatabase() {
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.profile.deleteMany();
}

export async function createTestUser(overrides = {}) {
  const hashedPassword = await bcrypt.hash('password123', 10);
  return prisma.profile.create({
    data: {
      username: overrides.username || 'testuser',
      email: overrides.email || 'test@example.com',
      password: hashedPassword,
      name: overrides.name || 'Test User',
    },
  });
}