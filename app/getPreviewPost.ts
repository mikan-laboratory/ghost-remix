import { prisma } from './db.server';

export const getPreviewPost = async (uuid: string) => {
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

  return {
    ...post,
    tags: post.posts_tags,
    authors: post.posts_authors,
  };
};
