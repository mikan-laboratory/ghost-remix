import { useLoaderData, useFetcher } from '@remix-run/react';
import { Image, Box, Heading, Flex } from '@chakra-ui/react';
import { getPost } from '~/content-api/getPost';
import { getCommentsForPost } from '~/content-api/getCommentsForPost';
import { LoaderFunction, ActionFunction, json, redirect } from '@remix-run/node';
import PostContent from '~/components/PostContent';
import AuthorsList from '~/components/AuthorsList';
import TopicsList from '~/components/TopicsList';
import Header from '~/components/Header';
import CommentsList from '~/components/CommentsList';
import { PostOrPage } from '@tryghost/content-api';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const loader: LoaderFunction = async ({ params }) => {
  const postSlug = params.postSlug;
  if (!postSlug) {
    throw new Response('Not Found', { status: 404 });
  }
  const post = (await getPost(postSlug)) as PostOrPage & { comments: boolean };
  if (!post || !post.id) {
    throw new Response('Post ID not found', { status: 404 });
  }

  //this checks if comments are active. If they are not, it would throw an error response code without this
  if (post.comments) {
    const comments = await getCommentsForPost(post.id);
    return [post, comments];
  }
  const comments: null = null;
  return [post, comments];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const postId = formData.get('postId');
  const memberId = formData.get('memberId'); // Replace with actual authenticated memberId
  const commentHtml = formData.get('comment');

  if (typeof commentHtml !== 'string' || typeof postId !== 'string') {
    return json({ error: 'Invalid form data' }, { status: 400 });
  }
  if (typeof postId !== 'string') {
    throw new Error("Invalid input for 'postId'");
  }

  if (typeof memberId !== 'string') {
    throw new Error("Invalid input for 'postId'");
  }

  // Create a new comment using Prisma
  const newComment = await prisma.comments.create({
    data: {
      id: uuidv4(),
      post_id: postId,
      member_id: memberId, // This should be the ID of the member making the comment
      html: commentHtml,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return redirect(request.url); // Adjust the redirect as needed
};

export default function Post() {
  const [post, comments] = useLoaderData<typeof loader>();
  const postHtml: string = post.html;

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
      <Box textColor="text2">
        {comments && <CommentsList comments={comments} postId={post.id} postSlug={post.slug} />}
      </Box>
    </Box>
  );
}
