import { PrismaClient } from '@prisma/client';
import { seedCommon } from './seedCommon';
import { wrapSeed } from './wrapSeed';

const prisma = new PrismaClient();

wrapSeed({ prisma, seedFunction: seedCommon });
