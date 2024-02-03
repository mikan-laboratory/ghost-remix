import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedComments = async (): Promise<void> => {
  await prisma.comments.deleteMany();

  const posts = await prisma.posts.findMany();
  const members = await prisma.members.findMany();

  for (const post of posts) {
    // Create a certain number of comments for each post
    for (let i = 0; i < 5; i++) {
      const member = faker.helpers.arrayElement(members);
      await prisma.comments.create({
        data: {
          id: randomUUID(),
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
