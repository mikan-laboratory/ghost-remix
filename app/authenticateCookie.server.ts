import { parse } from 'cookie';
import { prisma } from './db.server';
import { env } from './env';
import { BasicMember } from './types/member';
import jwt from 'jsonwebtoken';

export const authenticateCookie = async (request: Request): Promise<{ member: BasicMember | null }> => {
  const defaultReturn = { member: null };

  try {
    const cookieHeader = request.headers.get('Cookie');

    if (!cookieHeader) return defaultReturn;

    const cookies = parse(cookieHeader);

    const token = cookies.token;

    if (!token) return defaultReturn;

    const decoded = jwt.verify(token, env.JWT_SECRET) as BasicMember;

    const member = await prisma.members.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!member) return defaultReturn;

    return { member };
  } catch (error) {
    console.error(error);

    return defaultReturn;
  }
};
