import { Grid, GridItem } from '@chakra-ui/react';
import { PostOrPage } from '@tryghost/content-api';
import BlogItem from './BlogItem';

interface BlogListProps {
  posts: PostOrPage[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6} py={8}>
      {posts.map((post: PostOrPage) => (
        <BlogItem key={post.id} post={post} type="list" />
      ))}
    </Grid>
  );
}
