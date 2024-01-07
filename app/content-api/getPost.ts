import { ghostContentAPI } from './ghostContentAPI';

export const getPost = async (slug: string) => {
  return ghostContentAPI.posts.read({
    slug: slug,
  });
};
