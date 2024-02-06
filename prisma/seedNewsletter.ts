import { faker } from '@faker-js/faker';
import { PrismaClient, newsletters } from '@prisma/client';
import ObjectId from 'bson-objectid';

export const seedNewsletter = async (prisma: PrismaClient): Promise<newsletters> => {
  return prisma.newsletters.upsert({
    create: {
      id: ObjectId().toHexString(),
      uuid: faker.string.uuid(),
      name: 'Default Newsletter',
      slug: 'default-newsletter',
      status: 'active',
      visibility: 'members',
      background_color: 'light',
      sort_order: 0,
      title_font_category: 'sans-serif',
      title_alignment: 'center',
      body_font_category: 'sans-serif',
      sender_reply_to: 'newsletter',
      show_feature_image: true,
      subscribe_on_signup: true,
      show_header_title: true,
      show_header_icon: true,
      show_post_title_section: true,
      show_comment_cta: false,
      show_header_name: false,
      show_subscription_details: false,
      show_badge: false,
      show_latest_posts: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    update: {
      updated_at: new Date(),
    },
    where: {
      name: 'Default Newsletter',
    },
  });
};
