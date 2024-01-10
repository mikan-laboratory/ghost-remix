import { useLoaderData } from '@remix-run/react';
import { Button, Box, Heading, Text } from '@chakra-ui/react';
import { getPost } from '~/content-api/getPost';
import { LoaderFunction } from '@remix-run/node';
import PostContent from '~/components/PostContent';
import AuthorsList from '~/components/AuthorsList';
import TopicsList from '~/components/TopicsList';
import colors from '~/theme/colors';

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
    <Box minHeight="100vh" backgroundColor={colors.background}>
      {/* <Button as={Link} to="/" colorScheme="blue">
        Back to Blog List
      </Button> */}
      <Box p="10%">
        <Box pb={5} borderBottom={`2px solid ${colors.secondary}`}>
          <Heading fontSize={60} textColor={colors.primary}>
            {post.title}
          </Heading>
          <AuthorsList authors={post.authors} />
          {post.tags.length > 0 && <TopicsList topics={post.tags} />}
        </Box>
        <Box py={5} textColor={colors.text2}>
          <PostContent html={postHtml} />
        </Box>
      </Box>
    </Box>
  );
}
