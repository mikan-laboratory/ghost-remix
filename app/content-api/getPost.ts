import { ghostContentAPI } from './ghostContentAPI';

export const getPost = async (slug: string) => {
  return await ghostContentAPI.posts
    .read({
      slug: slug,
      include: 'authors,tags',
    } as any) //without any, we get an dumb red line on include even though its ok.
    .catch((err) => {
      console.error(err);
    });
};
