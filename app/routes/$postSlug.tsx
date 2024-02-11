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

export default function Post() {
  const loaderData = useLoaderData<{ post: PostOrPage; comments: CommentWithRelations[]; commentSettings: string }>();
  const { post, comments, commentSettings } = loaderData;

  return <PostPage post={post} comments={comments as any} commentSettings={commentSettings} />;
}
