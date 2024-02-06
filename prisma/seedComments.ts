import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import ObjectID from 'bson-objectid';

export const seedComments = async (prisma: PrismaClient): Promise<void> => {
  await prisma.comments.deleteMany();

  const posts = await prisma.posts.findMany();
  const members = await prisma.members.findMany();

  for (const post of posts) {
    for (let i = 0; i < 5; i++) {
      const member = faker.helpers.arrayElement(members);
      await prisma.comments.create({
        data: {
          id: ObjectID().toHexString(),
          post_id: post.id,
          member_id: member.id,
          html: `<p>${faker.lorem.sentence()}</p>`,
          created_at: new Date(),
          updated_at: new Date(),
          status: 'published',
        },
      });
    }
  }
};
