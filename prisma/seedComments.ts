import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedComments = async () => {
  // Assuming you already have posts created and want to add comments to them
  const posts = await prisma.posts.findMany();

  for (const post of posts) {
    // Create a certain number of comments for each post
    for (let i = 0; i < 5; i++) {
      await prisma.comments.create({
        data: {
          id: randomUUID(),
          post_id: post.id,
          // member_id: 'some_member_id', // Uncomment and set this if needed
          html: `<p>${faker.lorem.sentence()}</p>`,
          created_at: new Date(),
          updated_at: new Date(),
          status: 'published',
          // Optionally create nested comments
          // other_comments: {
          //   create: [{ id: randomUUID(), html: `<p>${faker.lorem.sentence()}</p>`, /* ...other fields */ }],
          // },
        },
      });
    }
  }
};

seedComments()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
