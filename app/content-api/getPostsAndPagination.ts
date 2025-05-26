import { prisma } from '~/db.server';
import { PostsAndPagination } from './types';
import { PostsOrPages } from '@tryghost/content-api';
import { fixFeatureImages } from '~/fixFeatureImages';

export const getPostsAndPagination = async (page = 1, limit = 5): Promise<PostsAndPagination> => {
  const [posts, totalPosts] = await Promise.all([
    prisma.posts.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        type: 'post',
        status: 'published',
      },
      select: {
        id: true,
        title: true,
        feature_image: true,
        slug: true,
        published_at: true,
        custom_excerpt: true,
      },
      orderBy: {
        published_at: 'desc',
      },
    }),
    prisma.posts.aggregate({
      where: {
        type: 'post',
        status: 'published',
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  return {
    posts: fixFeatureImages(posts as PostsOrPages),
    totalPages: Math.ceil(totalPosts._count._all / limit),
    totalPosts: totalPosts._count._all,
  };
};
