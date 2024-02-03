import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function seedMembers(count = 10) {
  await prisma.members.deleteMany();

  for (let i = 0; i < count; i++) {
    await prisma.members.create({
      data: {
        id: faker.string.uuid(),
        uuid: faker.string.uuid(),
        transient_id: faker.string.uuid(),
        email: faker.internet.email(),
        status: 'free', // Assuming 'free' is one of the valid statuses
        name: faker.person.fullName(),
        expertise: faker.lorem.word(),
        note: faker.lorem.sentence(),
        geolocation: faker.location.country(),
        enable_comment_notifications: faker.datatype.boolean(),
        email_count: faker.number.int({ max: 1000 }),
        email_opened_count: faker.number.int({ max: 1000 }),
        email_open_rate: faker.number.int({ min: 0, max: 100 }),
        email_disabled: faker.datatype.boolean(),
        last_seen_at: faker.date.past(),
        last_commented_at: faker.date.past(),
        created_at: new Date(),
        created_by: 'system',
        updated_at: new Date(),
        updated_by: 'system',
      },
    });
  }
}
