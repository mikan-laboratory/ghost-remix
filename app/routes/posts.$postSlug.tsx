//External Library Imports
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction, ActionFunction, json, redirect, MetaFunction } from '@remix-run/node';
import { Image, Box, Heading, Flex } from '@chakra-ui/react';
import { PostOrPage } from '@tryghost/content-api';
import { comments as prismaComments } from '@prisma/client';
// Internal Module Imports
import { getPost } from '~/content-api/getPost';
import { getCommentsForPost } from '~/content-api/getCommentsForPost';
import PostContent from '~/components/PostContent';
import AuthorsList from '~/components/AuthorsList';
import TopicsList from '~/components/TopicsList';
import Header from '~/components/Header';
import CommentsList from '~/components/CommentsList';
import { prisma } from '../db.server';
import { authenticateCookie } from '~/authentication.server';
import { getCommentSettings } from '~/content-api/getCommentSettings';
import { CommentWithRelations } from '~/components/types';
import { randomUUID } from 'crypto';

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

  if (!post) {
    throw new Response('Post not found', { status: 404 });
  }

  const commentSettings = await getCommentSettings();

  const comments: prismaComments[] = post.comments ? await getCommentsForPost(post.id) : [];

  return json({ post, comments, commentSettings });
};

const handlePostComment = async ({ memberId, formData }: { memberId: string; formData: FormData }) => {
  const postId = formData.get('postId');
  const commentHtml = formData.get('comment');

  if (typeof commentHtml !== 'string' || typeof postId !== 'string') {
    throw new Error('Invalid form data');
  }

  if (typeof postId !== 'string') {
    throw new Error("Invalid input for 'postId'");
  }

  await prisma.comments.create({
    data: {
      id: randomUUID(),
      post_id: postId,
      member_id: memberId,
      html: commentHtml,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
};

const handleDeleteComment = async ({ memberId, formData }: { memberId: string; formData: FormData }) => {
  const commentId = formData.get('commentId');

  if (typeof commentId !== 'string') {
    throw new Error("Invalid input for 'commentId'");
  }

  await prisma.comments.delete({
    where: { id: commentId, member_id: memberId },
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  try {
    const maybeMember = await authenticateCookie(request);
    const memberFromJson = await maybeMember.json();
    const commentSettings = await getCommentSettings();

    if (commentSettings === 'off') {
      throw new Error('Comments are disabled');
    }

    if (!memberFromJson.member) {
      throw new Error('Unauthorized');
    }

    const formData = await request.formData();
    const actionType = formData.get('actionType');

    switch (actionType) {
      case 'postComment':
        await handlePostComment({ memberId: memberFromJson.member.id, formData });
        break;
      case 'deleteComment':
        await handleDeleteComment({ formData, memberId: memberFromJson.member.id });
        break;
      default:
        throw new Error('Invalid action type');
    }

    return redirect(`/posts/${params.postSlug}`);
  } catch (error) {
    console.error(error);

    return json({ error: (error as Error).message }, { status: 400 });
  }
};

export default function Post() {
  const loaderData = useLoaderData<{ post: PostOrPage; comments: CommentWithRelations[]; commentSettings: string }>();
  const { post, comments, commentSettings } = loaderData;

  const authors = post.authors ?? [];
  const tags = post.tags ?? [];

  return (
    <Box minHeight="100vh" px="100px" py="5%" backgroundColor="background">
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
          <AuthorsList authors={authors} />
          {tags.length > 0 && <TopicsList topics={tags} />}
        </Flex>
      </Box>
      <Box py={5} textColor="text2">
        <PostContent html={post.html ?? ''} />
      </Box>
      {commentSettings !== 'off' && (
        <Box>
          <CommentsList comments={comments as any} postId={post.id} postSlug={post.slug} />
        </Box>
      )}
    </Box>
  );
}
