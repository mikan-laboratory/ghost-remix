import { ghostContentAPI } from './ghostContentAPI';

export const getSearchResults = async (query: string = '', page = 1, limit = 5) => {
  const tagsList = query.replaceAll(' ', ',');
  console.log('List', tagsList);
  const filterQuery = `title:~'${query}'`;
  const posts = await ghostContentAPI.posts.browse({
    limit: limit,
    page: page,
    include: 'authors',
    fields: 'published_at,id,feature_image,feature_image_alt,title,excerpt,slug',
    filter: filterQuery,
  });

  const { pages: totalPages, total: totalPosts } = posts.meta.pagination;

  return {
    posts,
    totalPages,
    totalPosts,
  };
};
