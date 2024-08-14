import { Box, Text } from '@chakra-ui/react';
import { PostOrPage } from '@tryghost/content-api';
import BlogItem from './BlogItem';
import { GetPostOutput } from '~/content-api/types';
import { JsonCompatibleObject } from './types';

interface BlogHeroProps {
  posts: PostOrPage[];
}

export default function BlogHero({ posts }: BlogHeroProps) {
  return (
    <Box display="flex" flexDirection="column" gap={4} px={5}>
      <Text color="primary" fontWeight="bold">
        Featured Articles
      </Text>
      <BlogItem post={posts[0] as JsonCompatibleObject<GetPostOutput>} type="primary" />
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        gap={{ base: 8, md: 2 }}
        pt={4}
        min-width="100%"
      >
        <BlogItem post={posts[1] as JsonCompatibleObject<GetPostOutput>} type="secondary" />
        <BlogItem post={posts[2] as JsonCompatibleObject<GetPostOutput>} type="secondary" />
      </Box>
    </Box>
  );
}
