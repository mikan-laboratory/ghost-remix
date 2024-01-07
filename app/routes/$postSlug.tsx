import { useParams, Link, useLoaderData } from '@remix-run/react';
import { Button, Box, Heading, Text } from '@chakra-ui/react';
import { getPost } from '~/content-api/getPost';
import { LoaderFunction } from '@remix-run/node';
import PostContent from '~/components/PostContent';

export const loader: LoaderFunction = async ({ params }) => {
  const postSlug = params.postSlug;
  if (!postSlug) {
    throw new Response('Not Found', { status: 404 });
  }
  const post = await getPost(postSlug);
  return post;
};

export default function Post() {
  const post = useLoaderData<typeof loader>();
  const postHtml: string = post.html;
  console.log(post);

  return (
    <Box>
      {/* <Button as={Link} to="/" colorScheme="blue">
        Back to Blog List
      </Button> */}
      <Box>
        <Heading fontSize={60}>{post.title}</Heading>
        <Text>written by: {post.author}</Text>
      </Box>
      <PostContent html={postHtml} />
    </Box>
  );
}
