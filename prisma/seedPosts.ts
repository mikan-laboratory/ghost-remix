import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { SecondarySeedParams } from './types';

export const seedPosts = async ({ user, prisma }: SecondarySeedParams): Promise<void> => {
  await prisma.posts.deleteMany();

  for (let i = 0; i < 10; i++) {
    const postId = randomUUID();
    await prisma.posts.upsert({
      create: {
        uuid: postId,
        id: postId,
        email_recipient_filter: 'all',
        title: faker.lorem.sentence(),
        slug: faker.lorem.slug(),
        html: `<p>${faker.lorem.paragraphs()}</p>`,
        plaintext: faker.lorem.text(),
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
