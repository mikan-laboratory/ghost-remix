//External Library Imports
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { PostOrPage } from '@tryghost/content-api';
// Internal Module Imports
import { prisma } from '../db.server';
import { CommentWithRelations } from '~/components/types';
import ObjectID from 'bson-objectid';
import { PostPage } from '~/components/PostPage';
import { getPostCommentsAndCommentSettings } from '~/content-api/getPostAndComments';

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const postSlug = params.postSlug;

    if (!postSlug) {
      throw new Error('Not Found');
    }

    const getPostResult = await getPostCommentsAndCommentSettings(postSlug);

    return json(getPostResult);
  } catch (error) {
    console.log(error);

    return json({ error: (error as Error).message }, { status: 400 });
  }
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

export default function Post() {
  const loaderData = useLoaderData<{ post: PostOrPage; comments: CommentWithRelations[]; commentSettings: string }>();
  const { post, comments, commentSettings } = loaderData;

  return <PostPage post={post} comments={comments as any} commentSettings={commentSettings} />;
}
