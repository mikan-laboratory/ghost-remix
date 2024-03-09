import { Box } from '@chakra-ui/react';
import { PostOrPage } from '@tryghost/content-api';
import BlogHeroItem from './BlogHeroItem';

interface BlogListItemProps {
  posts: PostOrPage[];
}

export default function BlogHero({ posts }: BlogListItemProps) {
  return (
    <Box>
      <BlogHeroItem post={posts[0]} />
      <BlogHeroItem post={posts[1]} />
      <BlogHeroItem post={posts[2]} />
    </Box>
  );
}
