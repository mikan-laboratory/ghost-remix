//External Library Imports
import { PostOrPage } from '@tryghost/content-api';
import { ghostContentAPI } from './ghostContentAPI';

export const getPost = async (slug: string): Promise<PostOrPage> => {
  return ghostContentAPI.posts.read({
    slug: slug,
    include: 'authors,tags,comments,slug',
  } as any); //without any, we get an dumb red line on include even though its ok.
};
