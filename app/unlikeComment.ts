import { prisma } from '~/db.server';
import { LikeCommentParams } from './routes/types';

export const unlikeComment = async ({ commentId, member }: LikeCommentParams): Promise<void> => {
  await prisma.comment_likes.deleteMany({
    where: {
      comment_id: commentId,
      member_id: member.id,
    },
  });
};
