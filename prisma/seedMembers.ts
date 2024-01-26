import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seedMembers(count = 10) {
  for (let i = 0; i < count; i++) {
    await prisma.members.create({
      data: {
        id: faker.datatype.uuid(),
        transient_id: faker.datatype.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        expertise: faker.lorem.word(),
        note: faker.lorem.sentence(),
        geolocation: faker.address.country(),
        created_at: new Date(),
        created_by: 'system', // Assuming a 'system' user or similar
        // Add other fields as necessary
      },
    });
  }
}
