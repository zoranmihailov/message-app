import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const users = [
  { username: 'marko', email: 'marko@example.com', name: 'Marko Petrov' },
  { username: 'jane', email: 'jane@example.com', name: 'Jane Doe' },
  { username: 'stefan', email: 'stefan@example.com', name: 'Stefan Ilievski' },
  { username: 'ana', email: 'ana@example.com', name: 'Ana Kovacevska' },
  { username: 'petar', email: 'petar@example.com', name: 'Petar Nikolov' },
  { username: 'elena', email: 'elena@example.com', name: 'Elena Trajkovska' },
  { username: 'filip', email: 'filip@example.com', name: 'Filip Stojanov' },
  { username: 'maja', email: 'maja@example.com', name: 'Maja Georgieva' },
  { username: 'igor', email: 'igor@example.com', name: 'Igor Dimitrov' },
  { username: 'sara', email: 'sara@example.com', name: 'Sara Angelova' },
];

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  for (const u of users) {
    await prisma.profile.upsert({
      where: { username: u.username },
      update: {}, 
      create: {
        username: u.username,
        email: u.email,
        password: hashedPassword,
        name: u.name,
        bio: `Hi, I'm ${u.name.split(' ')[0]}!`,
      },
    });
  }

  console.log(`Seeded ${users.length} users successfully`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });