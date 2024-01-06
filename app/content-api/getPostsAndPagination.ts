import { ghostContentAPI } from './ghostContentAPI';

export const getPostsAndPagination = async (page = 1, limit = 5) => {
  const posts = await ghostContentAPI.posts.browse({
    limit: limit,
    page: page,
    include: 'authors',
  });

  const { pages: totalPages, total: totalPosts } = posts.meta.pagination;

  return {
    posts,
    totalPages,
    totalPosts,
  };
};
