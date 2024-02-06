import { PrismaClient, users } from '@prisma/client';
import bcrypt from 'bcrypt';
import ObjectID from 'bson-objectid';

export const seedUser = async (prisma: PrismaClient): Promise<users> => {
  const hashedPassword = await bcrypt.hash(process.env.OWNER_PASSWORD as string, 10);
  const firstUserId = '1';

  const createUpdateUser = {
    id: firstUserId,
    name: process.env.OWNER_NAME as string,
    email: process.env.OWNER_EMAIL as string,
    password: hashedPassword,
    slug: process.env.OWNER_SLUG as string,
    status: 'active',
    visibility: 'public',
    created_at: new Date(),
    updated_at: new Date(),
    last_seen: new Date(),
    created_by: '1',
  };

  const user = await prisma.users.upsert({
    create: createUpdateUser,
    update: createUpdateUser,
    where: {
      id: firstUserId,
    },
  });

  const ownerRole = await prisma.roles.upsert({
    create: {
      id: ObjectID().toHexString(),
      name: 'Owner',
      description: 'Blog Owner',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: firstUserId,
    },
    update: {
      updated_at: new Date(),
      created_by: firstUserId,
    },
    where: {
      name: 'Owner',
    },
  });

  await prisma.roles_users.deleteMany({
    where: {
      user_id: firstUserId,
      role_id: ownerRole.id,
    },
  });

  await prisma.roles_users.create({
    data: {
      id: ObjectID().toHexString(),
      user_id: firstUserId,
      role_id: ownerRole.id,
    },
  });

  return user;
};
