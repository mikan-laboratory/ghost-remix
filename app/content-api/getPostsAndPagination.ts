//External Library Imports
import { PostsOrPages } from '@tryghost/content-api';
import { ghostContentAPI } from './ghostContentAPI';

interface PostsAndPagination {
  posts: PostsOrPages;
  totalPages: number;
  totalPosts: number;
}

export const getPostsAndPagination = async (page = 1, limit = 5): Promise<PostsAndPagination> => {
  const posts = await ghostContentAPI.posts.browse({
    limit: limit,
    page: page,
    include: 'authors',
    fields: 'published_at,id,feature_image,feature_image_alt,title,excerpt,slug',
  });

  const { pages: totalPages, total: totalPosts } = posts.meta.pagination;

  return {
    posts,
    totalPages,
    totalPosts,
  };
};
