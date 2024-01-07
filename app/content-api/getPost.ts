import { ghostContentAPI } from './ghostContentAPI';

export const getPost = async (id: string) => {
  return ghostContentAPI.posts.read({
    id: id,
  });
};
