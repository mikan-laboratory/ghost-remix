import { PrismaClient, users } from '@prisma/client';
import { seedUser } from './seedUser';
import { seedSettings } from './seedSettings';
import { seedIntegrations } from './seedIntegrations';

export const seedCommon = async (prisma: PrismaClient): Promise<users> => {
  const user = await seedUser(prisma);

  await seedSettings({ user, prisma });
  await seedIntegrations({ user, prisma });

  return user;
};
