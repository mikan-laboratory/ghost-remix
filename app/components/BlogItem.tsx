import dayjs from 'dayjs';
import { Box, Text } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import TopicsList from './TopicsList';
import { PostImage } from './PostImage';
import { JsonCompatibleObject } from './types';
import { GetPostOutput } from '~/content-api/types';

interface BlogListItemProps {
  post?: JsonCompatibleObject<GetPostOutput>;
  type: string;
}

export default function BlogItem({ post, type }: BlogListItemProps) {
  if (!post) return null;

  const hasFeatureImage = !!post.feature_image;

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'column', md: type === 'primary' && hasFeatureImage ? 'row' : 'column' }}
      height={{ base: 'auto', md: type === 'primary' && hasFeatureImage ? '409px' : 'auto' }}
      gap={{ base: 2, md: type === 'primary' ? 4 : 2 }}
      width="100%"
    >
      {hasFeatureImage && (
        <Box
          position="relative"
          height={{ base: '200px', md: type === 'primary' ? '100%' : '200px' }}
          overflow="hidden"
          width={{ base: '100%', md: type === 'primary' ? '60%' : '100%' }}
        >
          <Link to={`/${post.slug}`}>
            <PostImage post={post} />
            <Box
              position="absolute"
              backgroundColor="primary"
              color="text3"
              borderEndRadius="md"
              py={1}
              px={3}
              top="10%"
              fontSize="md"
            >
              {post.title}
            </Box>
          </Link>
        </Box>
      )}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        width={{ base: '100%', md: type === 'primary' && hasFeatureImage ? '40%' : '100%' }}
        py={2}
      >
        <Box>
          <Text color="text2" fontSize="xs">
            {post.published_at ? dayjs(post.published_at).format('MMMM DD, YYYY') : 'Some Date'}
          </Text>

          <Link to={`/${post.slug}`}>
            <Text
              fontSize={{ base: '2xl', md: 'xl' }}
              fontWeight="bolder"
              textColor="primary"
              sx={{ _hover: { color: 'tertiary2' } }}
            >
              {post.title}
            </Text>
          </Link>

          {type !== 'list' && (
            <Text mt={1} textColor="text2" fontSize="sm">
              {post.custom_excerpt?.slice(0, 150).trim()}
              {post.custom_excerpt && post.custom_excerpt.length > 150 ? '...' : ''}
            </Text>
          )}
          {type === 'list' && (
            <Text mt={1} textColor="text2" fontSize="sm">
              {post.custom_excerpt?.slice(0, 100).trim()}
              {post.custom_excerpt && post.custom_excerpt.length > 100 ? '...' : ''}
            </Text>
          )}
        </Box>
        <Box display="flex" gap={2} pt="2">
          {type !== 'list' && post?.tags?.[0] && <TopicsList topics={post.tags} />}
        </Box>
      </Box>
    </Box>
  );
}
