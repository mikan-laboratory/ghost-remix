import { prisma } from '../db.server';
import { GetPreviewPostOutput } from './types';

export const getPreviewPost = async (uuid: string): Promise<GetPreviewPostOutput> => {
  const post = await prisma.posts.findFirst({
    where: {
      uuid,
    },
    include: {
      comments: true,
      posts_tags: true,
      posts_authors: true,
    },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  const [authors, tags] = await Promise.all([
    prisma.users.findMany({
      where: {
        id: {
          in: post.posts_authors.map((author) => author.author_id),
        },
      },
      select: {
        name: true,
        slug: true,
        id: true,
      },
    }),
    prisma.tags.findMany({
      where: {
        id: {
          in: post.posts_tags.map((tag) => tag.tag_id),
        },
      },
      select: {
        name: true,
        slug: true,
        id: true,
      },
    }),
  ]);

  return {
    ...post,
    tags,
    authors,
  };
};
