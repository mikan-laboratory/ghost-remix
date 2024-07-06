import { prisma } from '~/db.server';
import { LikeCommentParams } from './routes/types';

export const likeComment = async ({ commentId, member }: LikeCommentParams): Promise<void> => {
  const like = await prisma.comment_likes.findFirst({
    where: {
      comment_id: commentId,
      member_id: member.id,
    },
  });

  if (like) {
    return;
  }

  await prisma.comment_likes.create({
    data: {
      comment_id: commentId,
      member_id: member.id,
    },
  });
};
