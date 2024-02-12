import { prisma } from './db.server';
import { BasicBlogInfo } from './types/blog';

export const getBasicBlogInfo = async (): Promise<BasicBlogInfo> => {
  const [blogName, blogDescription, pages] = await Promise.all([
    prisma.settings.findFirst({ select: { value: true }, where: { key: 'title' } }),
    prisma.settings.findFirst({ select: { value: true }, where: { key: 'description' } }),
    prisma.posts.findMany({ select: { title: true, slug: true }, where: { type: 'page', status: 'published' } }),
  ]);

  return {
    title: blogName?.value || 'Untitled',
    description: blogDescription?.value || 'No description',
    pages,
  };
};
