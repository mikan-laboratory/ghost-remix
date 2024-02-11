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

  const [authors, tags] = await Promise.all([
    prisma.users.findMany({
      where: {
        id: {
          in: post.posts_authors.map((author) => author.author_id),
        },
      },
      select: {
        name: true,
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
      },
    }),
  ]);

  return {
    ...post,
    tags,
    authors,
  };
};
