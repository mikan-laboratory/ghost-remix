import { PrismaClient } from '@prisma/client';
import { seedCommon } from './seedCommon';
import { seedPosts } from './seedPosts';
import { seedComments } from './seedComments';
import { seedMembers } from './seedMembers';
import { seedNewsletter } from './seedNewsletter';

export const seedWithPosts = async (prisma: PrismaClient): Promise<void> => {
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF;');

  const user = await seedCommon(prisma);

  await seedPosts({ user, prisma });

  const newsletter = await seedNewsletter(prisma);

  await seedMembers({ count: 10, prisma, newsletter });
  await seedComments(prisma);

  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;');
};
