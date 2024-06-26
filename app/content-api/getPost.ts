//External Library Imports
import { prisma } from '~/db.server';
import { ghostContentAPI } from './ghostContentAPI';
import { GetPostOutput } from './types';

export const getPost = async (slug: string): Promise<GetPostOutput> => {
  const post = await prisma.posts.findFirstOrThrow({
    where: {
      slug,
    },
    select: {
      type: true,
    },
  });

  if (post.type === 'post') {
    const apiPost = await ghostContentAPI.posts.read(
      {
        slug,
      },
      {
        include: ['authors', 'tags', 'count.posts'],
      },
    );

    return { ...apiPost, type: 'post' };
  }

  const apiPage = await ghostContentAPI.pages.read(
    {
      slug,
    },
    {
      include: ['authors', 'tags', 'count.posts'],
    },
  );

  return { ...apiPage, type: 'page' };
};
