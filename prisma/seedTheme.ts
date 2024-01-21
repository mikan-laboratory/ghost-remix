import { PrismaClient } from '@prisma/client';
import { wrapSeed } from './wrapSeed';
import fs from 'fs-extra';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export const parseThenSeed = async (): Promise<void> => {
  if (!process.env.THEME_SOURCE || !process.env.THEME_DESTINATION || !process.env.THEME_NAME) {
    console.log('Missing required environment variables');
    process.exit(1);
  }

  const { THEME_SOURCE, THEME_DESTINATION, THEME_NAME } = process.env;

  await fs.copy(THEME_SOURCE, THEME_DESTINATION, { overwrite: true });

  const seedTheme = async (prisma: PrismaClient): Promise<void> => {
    await prisma.settings.upsert({
      create: {
        id: randomUUID(),
        key: 'active_theme',
        type: 'string',
        value: THEME_NAME,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '1',
      },
      update: {
        value: THEME_NAME,
        updated_at: new Date(),
      },
      where: {
        key: 'active_theme',
      },
    });
  };

  wrapSeed({ prisma, seedFunction: seedTheme });
};

parseThenSeed();
