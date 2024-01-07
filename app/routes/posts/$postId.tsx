import { useParams, Link, useLoaderData } from '@remix-run/react';
import { Button, Box } from '@chakra-ui/react';
import { getPost } from '~/content-api/getPost';
import { LoaderFunction } from '@remix-run/node';

// export const loader: LoaderFunction = async ({ params }) => {
//   const postId = params.postId;
//   if (!postId) {
//     throw new Response('Not Found lol', { status: 404 });
//   }
//   const post = await getPost(postId);
//   return post;
// };

export default function Post() {
  //   const post = useLoaderData();

  return (
    <Box>
      <Button as={Link} to="/" colorScheme="blue">
        Back to Blog List
      </Button>
    </Box>
  );
}
