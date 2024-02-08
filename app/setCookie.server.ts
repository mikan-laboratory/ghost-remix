import { json, redirect } from '@remix-run/node';
import ObjectID from 'bson-objectid';
import { serialize } from 'cookie';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { prisma } from './db.server';
import { env } from './env';
import jwt from 'jsonwebtoken';

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

    if (dayjs().diff(dayjs(dbToken.created_at), 'minute') > 3) {
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

    const newsletter = await prisma.newsletters.findFirst();

    const memberNewsletter = newsletter
      ? {
          members_subscribe_events: {
            create: {
              id: ObjectID().toHexString(),
              newsletter_id: newsletter.id,
              subscribed: true,
              source: 'member',
              created_at: new Date(),
            },
          },
          members_newsletters: {
            create: {
              id: ObjectID().toHexString(),
              newsletter_id: newsletter.id,
            },
          },
        }
      : {};

    const memberId = ObjectID().toHexString();

    const member = await prisma.members.upsert({
      where: {
        email: parsed.email,
      },
      create: {
        id: memberId,
        uuid: randomUUID(),
        transient_id: ObjectID().toHexString(),
        email: parsed.email,
        name: parsed.name,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: memberId,
        updated_by: memberId,
        members_created_events: {
          create: {
            id: ObjectID().toHexString(),
            referrer_source: 'Direct',
            attribution_type: 'url',
            attribution_url: '/',
            source: 'member',
            created_at: new Date(),
            batch_id: ObjectID().toHexString(),
          },
        },
        members_status_events: {
          create: {
            id: ObjectID().toHexString(),
            to_status: 'free',
            created_at: new Date(),
          },
        },
        ...memberNewsletter,
      },
      update: {
        updated_at: new Date(),
        last_seen_at: new Date(),
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
      secure: env.ENVIRONMENT !== 'local',
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return redirect('/', {
      headers: {
        'Set-Cookie': cookie,
      },
    });
  } catch (error) {
    console.error(error);

    return json({ authenticated: false, error: (error as Error).message }, { status: 400 });
  }
};
