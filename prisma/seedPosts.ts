import { faker } from '@faker-js/faker';
import { SecondarySeedParams } from './types';
import ObjectID from 'bson-objectid';

export const seedPosts = async ({ user, prisma }: SecondarySeedParams): Promise<void> => {
  await prisma.posts.deleteMany();

  for (let i = 0; i < 10; i++) {
    const postId = ObjectID().toHexString();

    const isPost = i % 2 === 0;

    await prisma.posts.create({
      data: {
        uuid: faker.string.uuid(),
        id: postId,
        email_recipient_filter: 'all',
        title: faker.lorem.sentence(isPost ? 4 : 2),
        slug: faker.lorem.slug(),
        type: isPost ? 'post' : 'page',
        html: `<p>${faker.lorem.paragraphs()}</p>`,
        plaintext: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        published_at: new Date(),
        created_by: user.id,
        updated_by: user.id,
        status: 'published',
        posts_authors: {
          create: {
            id: ObjectID().toHexString(),
            author_id: user.id,
          },
        },
      },
    });
  }
};
