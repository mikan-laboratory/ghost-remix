import { PrismaClient, users } from '@prisma/client';

export interface SecondarySeedParams {
  user: users;
  prisma: PrismaClient;
}

export interface WrapSeedParams {
  prisma: PrismaClient;
  seedFunction: (prisma: PrismaClient) => Promise<any>;
}
