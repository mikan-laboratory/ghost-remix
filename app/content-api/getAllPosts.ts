import { ghostContentAPI } from './ghostContentAPI';

export const getPosts = async () => {
  return ghostContentAPI.posts.browse({
    limit: 'all',
    include: 'authors',
  });
};
