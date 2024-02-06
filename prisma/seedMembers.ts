import { PrismaClient, newsletters } from '@prisma/client';
import { faker } from '@faker-js/faker';
import ObjectID from 'bson-objectid';

export async function seedMembers({
  count,
  prisma,
  newsletter,
}: {
  count: number;
  prisma: PrismaClient;
  newsletter: newsletters;
}) {
  await prisma.members.deleteMany();

  for (let i = 0; i < count; i++) {
    const memberId = ObjectID().toHexString();

    await prisma.members.create({
      data: {
        id: memberId,
        uuid: faker.string.uuid(),
        transient_id: faker.string.uuid(),
        email: faker.internet.email(),
        status: 'free',
        name: faker.person.fullName(),
        enable_comment_notifications: true,
        email_count: 0,
        email_opened_count: 0,
        email_disabled: false,
        last_seen_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        created_by: memberId,
        updated_by: memberId,
        members_created_events: {
          create: {
            id: ObjectID().toHexString(),
            referrer_source: 'Created manually',
            referrer_medium: 'Ghost Admin',
            source: 'admin',
            created_at: new Date(),
            batch_id: ObjectID().toHexString(),
          },
        },
        members_login_events: {
          create: {
            id: ObjectID().toHexString(),
            created_at: new Date(),
          },
        },
        members_status_events: {
          create: {
            id: ObjectID().toHexString(),
            to_status: 'free',
            created_at: new Date(),
          },
        },
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
      },
    });
  }
}
