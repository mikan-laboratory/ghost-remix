import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF;');

  const integrationId = randomUUID();
  const userEmail = 'test@example.com';

  await prisma.posts.deleteMany();
  await prisma.tags.deleteMany();
  await prisma.api_keys.deleteMany({
    where: {
      integration_id: integrationId,
    },
  });
  await prisma.integrations.deleteMany({
    where: {
      type: 'custom',
    },
  });
  await prisma.api_keys.deleteMany({
    where: {
      secret: process.env.GHOST_CONTENT_API_KEY as string,
    },
  });
  await prisma.users.deleteMany({
    where: {
      email: userEmail,
    },
  });

  const hashedPassword = await bcrypt.hash('password', 10);

  await axios.post(`${process.env.GHOST_URL}/ghost/admin/authentication/setup`, {
    blogTitle: 'Test',
    email: userEmail,
    name: 'test',
    password: hashedPassword,
  });

  const firstUser = await prisma.users.findFirstOrThrow();

  await prisma.users.create({
    data: {
      id: '2',
      name: 'test',
      email: userEmail,
      password: hashedPassword,
      slug: 'test',
      status: 'active',
      visibility: 'public',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUser.id,
    },
  });

  await prisma.posts.create({
    data: {
      uuid: randomUUID(),
      id: randomUUID(),
      email_recipient_filter: 'all',
      title: 'Hello World',
      slug: 'hello-world',
      html: '<p>Hello World</p>',
      plaintext: 'Hello World',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUser.id,
    },
  });

  await prisma.integrations.create({
    data: {
      id: integrationId,
      name: 'remix',
      slug: 'remix',
      description: 'Remix',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUser.id,
    },
  });

  await prisma.api_keys.create({
    data: {
      id: randomUUID(),
      integration_id: integrationId,
      type: 'content',
      secret: process.env.GHOST_CONTENT_API_KEY as string,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUser.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
