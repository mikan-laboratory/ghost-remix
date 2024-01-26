import { PrismaClient } from '@prisma/client';
import { seedCommon } from './seedCommon';
import { seedPosts } from './seedPosts';
import { seedComments } from './seedComments';

export const seedWithPosts = async (prisma: PrismaClient): Promise<void> => {
  const user = await seedCommon(prisma);

  await seedPosts({ user, prisma });
  await seedComments(); //testing comments
};
