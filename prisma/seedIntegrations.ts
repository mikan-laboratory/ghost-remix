import { SecondarySeedParams } from './types';
import ObjectID from 'bson-objectid';

export const seedIntegrations = async ({ user, prisma }: SecondarySeedParams): Promise<void> => {
  const firstUserId = user.id;
  const integrationId = ObjectID().toHexString();

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
      updated_at: new Date(),
    },
    where: {
      slug: 'remix',
    },
  });

  const ghostContentApiKeyAsString = process.env.GHOST_CONTENT_API_KEY as string;

  await prisma.api_keys.upsert({
    create: {
      id: ObjectID().toHexString(),
      integration_id: integrationId,
      type: 'content',
      secret: ghostContentApiKeyAsString,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUserId,
    },
    update: {
      updated_at: new Date(),
    },
    where: {
      secret: ghostContentApiKeyAsString,
    },
  });
};
