//External Library Imports
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction, ActionFunction, json, redirect, MetaFunction } from '@remix-run/node';
import { Image, Box, Heading, Flex } from '@chakra-ui/react';
import { PostOrPage } from '@tryghost/content-api';
import { PrismaClient, comments } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// Internal Module Imports
import { getPost } from '~/content-api/getPost';
import { getCommentsForPost } from '~/content-api/getCommentsForPost';
import PostContent from '~/components/PostContent';
import AuthorsList from '~/components/AuthorsList';
import TopicsList from '~/components/TopicsList';
import Header from '~/components/Header';
import CommentsList from '~/components/CommentsList';
import { prisma } from '../db.server';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'TITLE',
    },
    {
      name: 'description',
      content: 'description',
    },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const postSlug = params.postSlug;

  if (!postSlug) {
    throw new Response('Not Found', { status: 404 });
  }

  const post = (await getPost(postSlug)) as PostOrPage & { comments: boolean };

  if (!post || !post.id) {
    console.error(`Post not found for slug: ${postSlug}`);
    throw new Response('Post not found', { status: 404 });
  }

  const comments: comments[] = post.comments ? await getCommentsForPost(post.id) : [];

  return [post, comments];
};

const handlePostComment = async (formData: FormData) => {
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
      member_id: memberId,
      html: commentHtml,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
};

const handleDeleteComment = async (formData: FormData) => {
  const commentId = formData.get('commentId');

  if (typeof commentId !== 'string') {
    throw new Error("Invalid input for 'commentId'");
  }

  await prisma.comments.delete({
    where: { id: commentId },
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get('actionType');

  switch (actionType) {
    case 'postComment':
      await handlePostComment(formData);
      break;
    case 'deleteComment':
      await handleDeleteComment(formData);
      break;
    default:
      throw new Error('Invalid action type');
  }

  return redirect(`/${params.postSlug}`);
};

export default function Post() {
  const [post, comments] = useLoaderData<typeof loader>();
  const postHtml: string = post.html;

  return (
    <Box minHeight="100vh" px={{ base: 5, sm: 10, md: '100px' }} py="5%" backgroundColor="background">
      <Header />
      <Box pb={5} borderBottom="2px solid" borderColor="secondary">
        <Heading fontSize={{ base: 30, sm: 40, md: 60 }} textAlign={{ base: 'center', md: 'left' }} textColor="text1">
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
        {comments.length > 0 && <CommentsList comments={comments} postId={post.id} postSlug={post.slug} />}
      </Box>
    </Box>
  );
}
