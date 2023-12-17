import { List, ListItem, Stack } from '@chakra-ui/react';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getPosts } from '~/content-api/getPosts';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export const loader = async () => {
  return getPosts();
};

export default function Index() {
  const posts = useLoaderData<typeof loader>();

  return (
    <Stack>
      <List>
        {posts.map((post) => (
          <ListItem key={post.slug}>{post.title}</ListItem>
        ))}
      </List>
    </Stack>
  );
}
