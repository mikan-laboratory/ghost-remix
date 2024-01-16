import { PrismaClient } from '@prisma/client';
import { wrapSeed } from './wrapSeed';
import { seedWithPosts } from './seedWithPosts';

const prisma = new PrismaClient();

wrapSeed({ prisma, seedFunction: seedWithPosts });
