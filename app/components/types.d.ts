import { Prisma } from '@prisma/client';
import { GetPostOutput, GetPreviewPostOutput } from '~/content-api/types';
import { BasicMember } from '~/types/member';

export type JsonCompatible<T> = T extends Date
  ? string
  : T extends Array<infer U>
    ? JsonCompatibleArray<U>
    : T extends object
      ? JsonCompatibleObject<T>
      : T;

export interface JsonCompatibleArray<T> extends Array<JsonCompatible<T>> {}

export type JsonCompatibleObject<T> = {
  [P in keyof T]: JsonCompatible<T[P]>;
};

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
  comment: JsonCompatibleObject<CommonComment>;
  member: BasicMember | null;
}

export interface GetPostAndCommentsBase {
  comments: CommentWithRelations[];
  commentSettings: string;
}

export interface GetPreviewPostAndComments extends GetPostAndCommentsBase {
  post: GetPreviewPostOutput;
}

export interface GetPostAndComments extends GetPostAndCommentsBase {
  post: GetPostOutput;
}

export type PostPageProps = GetPostAndComments | GetPreviewPostAndComments;

export type JsonifiedPostPageProps = JsonCompatible<PostPageProps>;

export type SummarizePostSuccessResponse = {
  result: string;
};

export type SummarizePostFailureResponse = {
  error: string;
};

export type SummarizePostResponse = SummarizePostSuccessResponse | SummarizePostFailureResponse;
