import { WrapSeedParams } from './types';

export const wrapSeed = async ({ prisma, seedFunction }: WrapSeedParams): Promise<void> => {
  try {
    await seedFunction(prisma);
    console.log('Seed successful');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};
