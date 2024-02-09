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

const handlePostComment = async ({
  memberId,
  commentHtml,
  postId,
}: {
  memberId: string;
  commentHtml: string;
  postId: string;
}) => {
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

const handleDeleteComment = async ({ commentId, memberId }: { commentId: string; memberId: string }) => {
  if (typeof commentId !== 'string') {
    throw new Error("Invalid input for 'commentId'");
  }

  await prisma.comments.delete({
    where: { id: commentId, member_id: memberId },
  });
};

const toggleLikeComment = async ({ commentId, memberId }: { commentId: string; memberId: string }) => {
  console.log('click!');

  if (typeof commentId !== 'string' || typeof memberId !== 'string') {
    throw new Error('Invalid input');
  }

  const existingLike = await prisma.comment_likes.findFirst({
    where: {
      comment_id: commentId,
      member_id: memberId,
    },
  });

  if (existingLike) {
    console.log('UNLIKED!');
    await prisma.comment_likes.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    console.log('LIKED!');
    await prisma.comment_likes.create({
      data: {
        id: randomUUID(),
        comment_id: commentId,
        member_id: memberId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  try {
    const maybeMember = await authenticateCookie(request);
    const memberFromJson = await maybeMember.json();
    const commentSettings = await getCommentSettings();

    if (commentSettings === 'off') {
      throw new Error('Comments are disabled');
    }

    // if (!memberFromJson.member) {
    //   throw new Error('Unauthorized');
    // }
    const requestBody = await request.json();
    // const formData = await request.formData();
    // const actionType = formData?.get('actionType')
    const actionType = requestBody.actionType;
    const commentId = requestBody.commentId;

    switch (actionType) {
      case 'postComment':
        // await handlePostComment({ memberId: memberFromJson.member.id, formData });
        await handlePostComment({
          memberId: '65c55f7505977406c9bdcf7f',
          commentHtml: requestBody.comment,
          postId: requestBody.postId,
        });
        break;
      case 'deleteComment':
        // await handleDeleteComment({ commentId, memberId: memberFromJson.member.id });
        await handleDeleteComment({ commentId, memberId: '65c55f7505977406c9bdcf7f' });
        break;
      case 'toggleLikeComment':
        // await toggleLikeComment({ formData, memberId: memberFromJson.member.id });
        await toggleLikeComment({ commentId, memberId: '65c55f7505977406c9bdcf7f' });
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
    <Box minHeight="100vh" backgroundColor="background" display="flex" justifyContent="center">
      <Box py="5%" px={{ base: 5, sm: 10 }} maxWidth="70em">
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
    </Box>
  );
}
