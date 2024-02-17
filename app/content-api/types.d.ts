import { Prisma } from '@prisma/client';
import { Author, PostOrPage, PostsOrPages, Tag } from '@tryghost/content-api';

export type GetPostOutput = PostOrPage & { type: string };

export interface PostsAndPagination {
  posts: PostsOrPages;
  totalPages: number;
  totalPosts: number;
}

export type PreviewPost = Prisma.postsGetPayload<{
  include: {
    comments: true;
    posts_tags: true;
    posts_authors: true;
  };
}>;

export type GetPreviewPostOutput = PreviewPost & {
  tags: Pick<Tag, 'id' | 'name' | 'slug'>[];
  authors: Pick<Author, 'id' | 'name' | 'slug'>[];
};
