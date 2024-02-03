import { PrismaClient } from '@prisma/client';
import { seedCommon } from './seedCommon';
import { seedPosts } from './seedPosts';
import { seedComments } from './seedComments';
import { seedMembers } from './seedMembers';

export const seedWithPosts = async (prisma: PrismaClient): Promise<void> => {
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF;');

  const user = await seedCommon(prisma);

  await seedPosts({ user, prisma });
  await seedMembers();
  await seedComments();

  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;');
};
