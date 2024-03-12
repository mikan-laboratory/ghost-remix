import { Box } from '@chakra-ui/react';
import { PostOrPage } from '@tryghost/content-api';
import BlogHeroItem from './BlogHeroItem';

interface BlogListItemProps {
  posts: PostOrPage[];
}

export default function BlogHero({ posts }: BlogListItemProps) {
  return (
    <Box display="flex" flexDirection="column" gap={8}>
      <BlogHeroItem post={posts[0]} type="main" />
      <Box display="flex" gap={8} min-width="100%">
        <BlogHeroItem post={posts[1]} type="secondary" />
        <BlogHeroItem post={posts[2]} type="secondary" />
      </Box>
    </Box>
  );
}
