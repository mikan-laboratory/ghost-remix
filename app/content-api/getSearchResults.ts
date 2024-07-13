import { Prisma } from '@prisma/client';
import { PostsAndPagination } from './types';
import { prisma } from '~/db.server';
import { PostsOrPages } from '@tryghost/content-api';
import { fixFeatureImages } from '~/fixFeatureImages';

export const getSearchResults = async (query = '', page = 1, limit = 5): Promise<PostsAndPagination> => {
  const baseWhere: Prisma.postsWhereInput = {
    type: 'post',
    status: 'published',
  };

  const searchCondition = query
    ? Prisma.sql`
    AND (
      LOWER(posts.title) LIKE LOWER(${`%${query}%`})
      OR LOWER(posts.slug) LIKE LOWER(${`%${query}%`})
      OR LOWER(author.name) LIKE LOWER(${`%${query}%`})
      OR LOWER(tags.name) LIKE LOWER(${`%${query}%`})
    )
  `
    : Prisma.sql``;

  const postsQuery = Prisma.sql`
  SELECT posts.title, posts.feature_image, posts.slug, posts.published_at, posts.custom_excerpt
  FROM posts
  LEFT JOIN posts_authors ON posts.id = posts_authors.post_id
  LEFT JOIN users AS author ON posts_authors.author_id = author.id
  LEFT JOIN posts_tags ON posts.id = posts_tags.post_id
  LEFT JOIN tags ON posts_tags.tag_id = tags.id
  WHERE posts.type = ${baseWhere.type}
    AND posts.status = ${baseWhere.status}
    ${searchCondition}
  ORDER BY posts.published_at DESC
  LIMIT ${limit}
  OFFSET ${(page - 1) * limit}
`;

  const countQuery = Prisma.sql`
  SELECT COUNT(*) as count
  FROM posts
  LEFT JOIN posts_authors ON posts.id = posts_authors.post_id
  LEFT JOIN users AS author ON posts_authors.author_id = author.id
  LEFT JOIN posts_tags ON posts.id = posts_tags.post_id
  LEFT JOIN tags ON posts_tags.tag_id = tags.id
  WHERE posts.type = ${baseWhere.type}
    AND posts.status = ${baseWhere.status}
    ${searchCondition}
`;

  const [posts, totalPosts] = await Promise.all([prisma.$queryRaw(postsQuery), prisma.$queryRaw(countQuery)]);

  // Explicit conversion from BigInt to Number
  const totalCount = (totalPosts as { count: bigint }[])[0] ? Number((totalPosts as { count: bigint }[])[0].count) : 0;

  return {
    posts: fixFeatureImages(posts as PostsOrPages),
    totalPages: Math.ceil(totalCount / limit),
    totalPosts: totalCount,
  };
};
