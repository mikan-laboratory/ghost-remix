import { prisma } from '~/db.server';
import { GetPostOutput } from './types';
import { Prisma } from '@prisma/client';

export const getPost = async (where: Prisma.postsWhereInput): Promise<GetPostOutput> => {
  const post = await prisma.posts.findFirstOrThrow({
    where,
    include: {
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
