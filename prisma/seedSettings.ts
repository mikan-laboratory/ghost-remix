import { SecondarySeedParams } from './types';
import ObjectID from 'bson-objectid';

export const seedSettings = async ({ user, prisma }: SecondarySeedParams): Promise<void> => {
  const firstUserId = user.id;

  await prisma.settings.upsert({
    create: {
      id: ObjectID().toHexString(),
      key: 'title',
      value: process.env.SITE_TITLE as string,
      type: 'string',
      flags: 'PUBLIC',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUserId,
    },
    update: {
      value: process.env.SITE_TITLE as string,
      created_at: new Date(),
    },
    where: {
      key: 'title',
    },
  });

  await prisma.settings.upsert({
    create: {
      id: ObjectID().toHexString(),
      key: 'description',
      value: process.env.SITE_DESCRIPTION as string,
      type: 'string',
      flags: 'PUBLIC',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUserId,
    },
    update: {
      value: process.env.SITE_DESCRIPTION as string,
      updated_at: new Date(),
    },
    where: {
      key: 'description',
    },
  });

  const hasMailgun = process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN && process.env.MAILGUN_BASE_URL;

  if (!hasMailgun) {
    console.log("Mailgun isn't configured; skipping mailgun settings seed");
    return;
  }

  await prisma.settings.upsert({
    create: {
      id: ObjectID().toHexString(),
      group: 'email',
      key: 'mailgun_api_key',
      value: process.env.MAILGUN_API_KEY as string,
      type: 'string',
      flags: 'PUBLIC',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUserId,
    },
    update: {
      value: process.env.MAILGUN_API_KEY as string,
      updated_at: new Date(),
    },
    where: {
      key: 'mailgun_api_key',
    },
  });

  await prisma.settings.upsert({
    create: {
      id: ObjectID().toHexString(),
      group: 'email',
      key: 'mailgun_domain',
      value: process.env.MAILGUN_DOMAIN as string,
      type: 'string',
      flags: 'PUBLIC',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUserId,
    },
    update: {
      value: process.env.MAILGUN_DOMAIN as string,
      updated_at: new Date(),
    },
    where: {
      key: 'mailgun_domain',
    },
  });

  await prisma.settings.upsert({
    create: {
      id: ObjectID().toHexString(),
      group: 'email',
      key: 'mailgun_base_url',
      value: process.env.MAILGUN_BASE_URL as string,
      type: 'string',
      flags: 'PUBLIC',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUserId,
    },
    update: {
      value: process.env.MAILGUN_BASE_URL as string,
      updated_at: new Date(),
    },
    where: {
      key: 'mailgun_base_url',
    },
  });
};
