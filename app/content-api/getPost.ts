import { prisma } from '~/db.server';
import { GetPostOutput } from './types';
import { Prisma } from '@prisma/client';
import { parseFeatureImage } from '~/parseFeatureImage';

export const getPost = async (where: Prisma.postsWhereInput): Promise<GetPostOutput> => {
  const post = await prisma.posts.findFirstOrThrow({
    where,
    include: {
      posts_tags: true,
      posts_authors: true,
      posts_meta: true,
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
    ...(post.feature_image && {
      feature_image: parseFeatureImage(post.feature_image),
    }),
    tags,
    authors,
  };
};
