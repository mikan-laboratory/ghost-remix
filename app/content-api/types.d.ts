import { Prisma } from '@prisma/client';
import { Author, PostsOrPages, Tag } from '@tryghost/content-api';

export interface PostsAndPagination {
  posts: PostsOrPages;
  totalPages: number;
  totalPosts: number;
}

export type DbPost = Prisma.postsGetPayload<{
  include: {
    posts_meta: true;
    posts_tags: true;
    posts_authors: true;
  };
}>;

export type GetPostOutput = DbPost & {
  tags: Pick<Tag, 'id' | 'name' | 'slug'>[];
  authors: Pick<Author, 'id' | 'name' | 'slug'>[];
};
