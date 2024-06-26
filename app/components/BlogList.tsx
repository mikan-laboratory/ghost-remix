import { Grid, Box, Text } from '@chakra-ui/react';
import { PostOrPage } from '@tryghost/content-api';
import BlogItem from './BlogItem';

interface BlogListProps {
  posts: PostOrPage[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <Box>
      <Text px={5} color="primary" fontWeight="bold">
        New Articles
      </Text>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={{ base: 8, sm: 6 }} py={8} px={5}>
        {posts.map((post: PostOrPage) => (
          <BlogItem key={post.id} post={post} type="list" />
        ))}
      </Grid>
    </Box>
  );
}
