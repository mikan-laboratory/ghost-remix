//External Library Imports
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction, ActionFunction, json, redirect, MetaFunction } from '@remix-run/node';
import { PostOrPage } from '@tryghost/content-api';
// Internal Module Imports
import { prisma } from '../db.server';
import { getCommentSettings } from '~/content-api/getCommentSettings';
import { CommentWithRelations } from '~/components/types';
import ObjectID from 'bson-objectid';
import { PostPage } from '~/components/PostPage';
import { authenticateCookie } from '~/authenticateCookie.server';
import { getPostCommentsAndCommentSettings } from '~/content-api/getPostAndComments';

export const loader: LoaderFunction = async ({ params }) => {
  const postSlug = params.postSlug;

  if (!postSlug) {
    throw new Response('Not Found', { status: 404 });
  }

  const getPostResult = await getPostCommentsAndCommentSettings(postSlug);

  return json(getPostResult);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data.post.title,
    },
  ];
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
      id: ObjectID().toHexString(),
      post_id: postId,
      member_id: memberId,
      html: commentHtml,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  await prisma.members.update({
    where: {
      id: memberId,
    },
    data: {
      last_commented_at: new Date(),
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

    return redirect(`/${params.postSlug}`);
  } catch (error) {
    console.error(error);

    return json({ error: (error as Error).message }, { status: 400 });
  }
};

export default function Post() {
  const loaderData = useLoaderData<{ post: PostOrPage; comments: CommentWithRelations[]; commentSettings: string }>();
  const { post, comments, commentSettings } = loaderData;

  return <PostPage post={post} comments={comments as any} commentSettings={commentSettings} />;
}
