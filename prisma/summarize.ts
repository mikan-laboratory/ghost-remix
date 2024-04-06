import { PrismaClient } from '@prisma/client';
import { summarizePosts } from './summarizePosts';
import { wrapSeed } from './wrapSeed';

const prisma = new PrismaClient();

wrapSeed({ prisma, seedFunction: summarizePosts });
