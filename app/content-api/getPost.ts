import { ghostContentAPI } from './ghostContentAPI';

export const getPost = async (slug: string) => {
  return await ghostContentAPI.posts
    .read({
      slug: slug,
      include: 'authors,tags',
      // fields: 'published_at,id,feature_image,feature_image_alt,title,excerpt,slug',
    } as any) //without any, we get an dumb red line on include even though its ok.
    .catch((err) => {
      console.error(err);
      return null;
    });
};
