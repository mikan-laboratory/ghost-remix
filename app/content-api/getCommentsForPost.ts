//External Library Imports
import { prisma } from '~/db.server';

export const getCommentsForPost = async (postId: string) => {
  const comments = await prisma.comments.findMany({
    where: {
      post_id: postId,
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      comment_likes: true,
      comment_reports: true,
      members: true,
      other_comments: true,
    },
  });

  return comments;
};
