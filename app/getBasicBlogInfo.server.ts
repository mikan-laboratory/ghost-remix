import { prisma } from './db.server';
import { BasicBlogInfo } from './types/blog';

export const getBasicBlogInfo = async (): Promise<BasicBlogInfo> => {
  const [blogName, blogDescription, signupSetting, pages, postCount] = await Promise.all([
    prisma.settings.findFirst({ select: { value: true }, where: { key: 'title' } }),
    prisma.settings.findFirst({ select: { value: true }, where: { key: 'description' } }),
    prisma.settings.findFirst({ select: { value: true }, where: { key: 'members_signup_access' } }),
    prisma.posts.findMany({ select: { title: true, slug: true }, where: { type: 'page', status: 'published' } }),
    prisma.posts.count({
      where: {
        type: 'post',
        status: 'published',
      },
    }),
  ]);

  return {
    title: blogName?.value ?? 'Untitled',
    description: blogDescription?.value ?? 'No description',
    signupEnabled: signupSetting?.value === 'all',
    pages,
    postCount,
  };
};
