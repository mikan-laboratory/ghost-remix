import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { SecondarySeedParams } from './types';
import ObjectId from 'bson-objectid';

export const seedPosts = async ({ user, prisma }: SecondarySeedParams): Promise<void> => {
  await prisma.posts.deleteMany();

  for (let i = 0; i < 10; i++) {
    const plaintext = faker.lorem.text();

    await prisma.posts.upsert({
      create: {
        uuid: randomUUID(),
        id: ObjectId().toHexString(),
        comment_id: ObjectId().toHexString(),
        email_recipient_filter: 'all',
        title: faker.lorem.sentence(),
        slug: faker.lorem.slug(),
        html: `<p>${faker.lorem.sentence()}</p>`,
        plaintext: faker.lorem.text(),
        lexical: JSON.stringify({
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: plaintext,
                    type: 'extended-text',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
          },
        }),
        created_at: new Date(),
        updated_at: new Date(),
        created_by: user.id,
        status: 'published',
      },
      update: {
        updated_at: new Date(),
      },
      where: {
        slug_type: {
          slug: faker.lorem.slug(),
          type: 'post',
        },
      },
    });
  }
};
