import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const integrationId = randomUUID();
  const userEmail = 'test@example.com';
  const hashedPassword = await bcrypt.hash('password', 10);

  const firstUserId = '1';

  const createUpdateUser = {
    id: firstUserId,
    name: 'test',
    email: userEmail,
    password: hashedPassword,
    slug: 'test',
    status: 'active',
    visibility: 'public',
    created_at: new Date(),
    updated_at: new Date(),
    last_seen: new Date(),
    created_by: '1',
  };

  const user = await prisma.users.upsert({
    create: createUpdateUser,
    update: createUpdateUser,
    where: {
      id: firstUserId,
    },
  });

  await prisma.settings.upsert({
    create: {
      id: randomUUID(),
      key: 'title',
      value: 'Test',
      type: 'string',
      flags: 'PUBLIC',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUserId,
    },
    update: {
      value: 'Test',
      created_at: new Date(),
    },
    where: {
      key: 'title',
    },
  });

  await prisma.settings.upsert({
    create: {
      id: randomUUID(),
      key: 'description',
      value: 'test description',
      type: 'string',
      flags: 'PUBLIC',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUserId,
    },
    update: {
      value: 'test description',
      created_at: new Date(),
    },
    where: {
      key: 'description',
    },
  });

  const ownerRole = await prisma.roles.upsert({
    create: {
      id: randomUUID(),
      name: 'Owner',
      description: 'Blog Owner',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUserId,
    },
    update: {
      created_at: new Date(),
      created_by: firstUserId,
    },
    where: {
      name: 'Owner',
    },
  });

  const rolesUsersId = randomUUID();

  await prisma.roles_users.deleteMany({
    where: {
      user_id: firstUserId,
    },
  });

  await prisma.roles_users.create({
    data: {
      id: rolesUsersId,
      user_id: firstUserId,
      role_id: ownerRole.id,
    },
  });

  const firstPostId = randomUUID();

  await prisma.posts.upsert({
    create: {
      uuid: randomUUID(),
      id: firstPostId,
      email_recipient_filter: 'all',
      title: 'Example Post',
      slug: 'example',
      html: '<p>Example Post</p>',
      plaintext: 'Example Post',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: user.id,
      status: 'published',
    },
    update: {
      created_at: new Date(),
    },
    where: {
      slug_type: {
        slug: 'example',
        type: 'post',
      },
    },
  });

  await prisma.integrations.upsert({
    create: {
      id: integrationId,
      name: 'remix',
      slug: 'remix',
      description: 'Remix',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUserId,
    },
    update: {
      created_at: new Date(),
    },
    where: {
      slug: 'remix',
    },
  });

  const ghostContentApiKeyAsString = process.env.GHOST_CONTENT_API_KEY as string;

  await prisma.api_keys.upsert({
    create: {
      id: randomUUID(),
      integration_id: integrationId,
      type: 'content',
      secret: ghostContentApiKeyAsString,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUserId,
    },
    update: {
      created_at: new Date(),
    },
    where: {
      secret: ghostContentApiKeyAsString,
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
