import { Box, Text } from '@chakra-ui/react';
import { PostOrPage } from '@tryghost/content-api';
import BlogItem from './BlogItem';

interface BlogHeroProps {
  posts: PostOrPage[];
}

export default function BlogHero({ posts }: BlogHeroProps) {
  return (
    <Box display="flex" flexDirection="column" gap={4} px={5}>
      <Text color="primary" fontWeight="bold">
        Featured Articles
      </Text>
      <BlogItem post={posts[0]} type="primary" />
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        gap={{ base: 8, md: 2 }}
        pt={4}
        min-width="100%"
      >
        <BlogItem post={posts[1]} type="secondary" />
        <BlogItem post={posts[2]} type="secondary" />
      </Box>
    </Box>
  );
}
