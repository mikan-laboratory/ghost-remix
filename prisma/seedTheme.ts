import { PrismaClient } from '@prisma/client';
import { wrapSeed } from './wrapSeed';
import fs from 'fs-extra';

const prisma = new PrismaClient();

export const parseThenSeed = async (): Promise<void> => {
  if (!process.env.THEME_SOURCE || !process.env.THEME_DESTINATION || !process.env.THEME_NAME) {
    console.log('Missing required environment variables');
    process.exit(1);
  }

  const { THEME_SOURCE, THEME_DESTINATION, THEME_NAME } = process.env;

  await fs.copy(THEME_SOURCE, THEME_DESTINATION, { overwrite: true });

  const seedTheme = async (prisma: PrismaClient): Promise<void> => {
    await prisma.settings.update({
      data: {
        value: THEME_NAME,
      },
      where: {
        key: 'active_theme',
      },
    });
  };

  wrapSeed({ prisma, seedFunction: seedTheme });
};

parseThenSeed();
