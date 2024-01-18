import { useLoaderData } from '@remix-run/react';
import { Image, Box, Heading, Flex } from '@chakra-ui/react';
import { getPost } from '~/content-api/getPost';
import { LoaderFunction } from '@remix-run/node';
import PostContent from '~/components/PostContent';
import AuthorsList from '~/components/AuthorsList';
import TopicsList from '~/components/TopicsList';
import Header from '~/components/Header';

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
    <Box minHeight="100vh" px="100px" py="5%" backgroundColor="background">
      {/* <Button as={Link} to="/" colorScheme="blue">
        Back to Blog List
      </Button> */}
      <Header />
      <Box pb={5} borderBottom="2px solid" borderColor="secondary">
        <Heading fontSize={60} textColor="text1">
          {post.title}
        </Heading>
        {post.feature_image && (
          <Box
            position="relative"
            width="100%"
            height="0"
            paddingBottom="40%"
            overflow="hidden"
            mt={5}
            borderRadius="xl"
          >
            <Image
              src={post.feature_image}
              alt={post.feature_image_alt || 'image'}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              minWidth="100%"
              minHeight="100%"
              objectFit="cover"
            />
          </Box>
        )}
        <Flex justifyContent="space-between" mt={5}>
          <AuthorsList authors={post.authors} />
          {post.tags.length > 0 && <TopicsList topics={post.tags} />}
        </Flex>
      </Box>
      <Box py={5} textColor="text2">
        <PostContent html={postHtml} />
      </Box>
      {post.comments && <Box>comments will be displayed here</Box>}
    </Box>
  );
}
