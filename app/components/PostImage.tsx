import { GetPostOutput } from '~/content-api/types';
import { JsonCompatibleObject } from './types';
import { Img } from '@chakra-ui/react';

interface PostImageProps {
  post: JsonCompatibleObject<GetPostOutput>;
}

export const PostImage = ({ post }: PostImageProps): JSX.Element => {
  const featureImageStartsWithSlash = (post.feature_image ?? '').startsWith('/');

  return (
    <Img
      src={post.feature_image as string}
      srcSet={
        featureImageStartsWithSlash
          ? `
      /api/image?name=${post.feature_image}&w=480 480w,
      /api/image?name=${post.feature_image}&w=800 800w,
      /api/image?name=${post.feature_image}&w=1200 1200w
    `
          : undefined
      }
      alt={post.posts_meta?.feature_image_alt ?? undefined}
      sizes={featureImageStartsWithSlash ? '(max-width: 480px) 480px,(max-width: 800px) 800px, 1200px' : undefined}
      decoding="async"
      loading="lazy"
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      minWidth="100%"
      minHeight="100%"
      objectFit="cover"
    />
  );
};
