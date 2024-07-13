import { PostsOrPages } from '@tryghost/content-api';
import { parseFeatureImage } from './parseFeatureImage';

export const fixFeatureImages = (posts: PostsOrPages): PostsOrPages => {
  return posts.map((post) => ({
    ...post,
    ...(post.feature_image && { feature_image: parseFeatureImage(post.feature_image) }),
  })) as PostsOrPages;
};
