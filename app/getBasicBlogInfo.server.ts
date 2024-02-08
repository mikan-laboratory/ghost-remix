import { prisma } from './db.server';

export const getBasicBlogInfo = async () => {
  const [blogName, blogDescription] = await Promise.all([
    prisma.settings.findFirst({ select: { value: true }, where: { key: 'title' } }),
    prisma.settings.findFirst({ select: { value: true }, where: { key: 'description' } }),
  ]);

  return {
    title: blogName?.value || 'Untitled',
    description: blogDescription?.value || 'No description',
  };
};
