import { Box } from '@chakra-ui/react';
import { PostOrPage } from '@tryghost/content-api';
import BlogItem from './BlogItem';

interface BlogHeroProps {
  posts: PostOrPage[];
}

export default function BlogHero({ posts }: BlogHeroProps) {
  return (
    <Box display="flex" flexDirection="column" gap={8} px={5}>
      <BlogItem post={posts[0]} type="primary" />
      <Box display="flex" flexDirection={{ base: 'column', sm: 'row' }} gap={8} min-width="100%">
        <BlogItem post={posts[1]} type="secondary" />
        <BlogItem post={posts[2]} type="secondary" />
      </Box>
    </Box>
  );
}
