import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const integrationId = randomUUID();
  const firstUserId = '1';

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
