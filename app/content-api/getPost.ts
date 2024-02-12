//External Library Imports
import { ghostContentAPI } from './ghostContentAPI';
import { GetPostOutput } from './types';

export const getPost = async (slug: string): Promise<GetPostOutput> => {
  try {
    const post = await ghostContentAPI.posts.read(
      {
        slug: slug,
      },
      {
        include: ['authors', 'tags', 'count.posts'],
      },
    );

    return { ...post, type: 'post' };
  } catch (error) {}

  const page = await ghostContentAPI.pages.read(
    {
      slug: slug,
    },
    {
      include: ['authors', 'tags', 'count.posts'],
    },
  );

  return { ...page, type: 'page' };
};
