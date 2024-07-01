import { CommentWithRelations } from '~/components/types';
import { prisma } from '~/db.server';

export const getCommentsForPost = async (postId: string): Promise<CommentWithRelations[]> => {
  const comments = await prisma.comments.findMany({
    where: {
      post_id: postId,
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      comment_likes: true,
      members: true,
      other_comments: {
        include: {
          comment_likes: true,
          members: true,
        },
      },
    },
  });

  return comments;
};
