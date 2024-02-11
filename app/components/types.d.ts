import { Prisma } from '@prisma/client';
import { BasicMember } from '~/types/member';

export type CommentWithRelations = Prisma.commentsGetPayload<{
  include: {
    comment_likes: true;
    members: true;
    other_comments: {
      include: {
        comment_likes: true;
        members: true;
      };
    };
  };
}>;

export type CommonComment = Omit<CommentWithRelations, 'other_comments'>;

export interface CommentInnerProps {
  comment: CommonComment;
  member: BasicMember | null;
}
