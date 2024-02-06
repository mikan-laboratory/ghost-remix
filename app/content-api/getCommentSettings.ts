import { prisma } from '~/db.server';

export const getCommentSettings = async (): Promise<string> => {
  const commentSettings = await prisma.settings.findFirst({
    where: { key: 'comments_enabled' },
    select: { value: true },
  });

  return commentSettings?.value ?? 'off';
};
