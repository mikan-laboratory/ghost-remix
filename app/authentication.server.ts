import { json, redirect } from '@remix-run/node';
import { parse, serialize } from 'cookie';
import { prisma } from './db.server';
import { env } from './env';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { BasicMember } from './types/member';

export const authenticateCookie = async (request: Request) => {
  const defaultReturn = json({ member: null });

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

    return json({ member });
  } catch (error) {
    console.error(error);

    return defaultReturn;
  }
};

export const setCookie = async (request: Request) => {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const token = queryParams.get('token');

    if (!token) return json({ authenticated: false });

    const dbToken = await prisma.tokens.findFirst({
      where: {
        token: token as string,
        used_count: {
          equals: 0,
        },
      },
      select: {
        id: true,
        data: true,
        created_at: true,
      },
    });

    if (!dbToken?.data) throw new Error('Invalid token');

    if (dayjs().diff(dayjs(dbToken.created_at), 'day') > 1) {
      throw new Error('Token expired');
    }

    await prisma.tokens.update({
      where: {
        id: dbToken.id,
      },
      data: {
        used_count: {
          increment: 1,
        },
      },
    });

    const parsed = JSON.parse(dbToken.data);

    const member = await prisma.members.upsert({
      where: {
        email: parsed.email,
      },
      create: {
        id: crypto.randomUUID(),
        transient_id: crypto.randomUUID(),
        email: parsed.email,
        name: parsed.name,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '1',
      },
      update: {
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const webToken = jwt.sign(member, env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const cookie = serialize('token', webToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: env.ENVIRONMENT === 'local' ? false : true,
    });

    return redirect('/', {
      headers: {
        'Set-Cookie': cookie,
      },
    });
  } catch (error) {
    return json({ authenticated: false, error: (error as Error).message }, { status: 400 });
  }
};
