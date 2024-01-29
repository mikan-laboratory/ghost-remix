//External Library Imports
import { ghostContentAPI } from './ghostContentAPI';

export const getSearchResults = async (query: string = '', page = 1, limit = 5) => {
  const queryList = query.toLowerCase().replaceAll(' ', ',');
  //Ghost API can't do partial/like filter with the current state of NQL, so this is a work around.
  let queryWords = query.split(' ');
  let transformedWords = queryWords.map((word) => `title:~'${word}'`);
  let titleList = transformedWords.join(', ');

  const filterQuery = `${titleList}, tags: [${queryList}], authors: [${queryList}]`;
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
