//External Library Imports
import { useLoaderData } from '@remix-run/react';
import { json, MetaFunction, LoaderFunctionArgs, TypedResponse } from '@remix-run/node';
// Internal Module Imports
import { PostPage } from '~/components/PostPage';
import { getPostCommentsAndCommentSettings } from '~/content-api/getPostAndComments';
import { GetPostAndComments } from '~/components/types';

export const loader = async ({ params }: LoaderFunctionArgs): Promise<TypedResponse<GetPostAndComments>> => {
  try {
    const postSlug = params.postSlug;

    if (!postSlug) {
      throw new Error('Not Found');
    }

    const getPostResult = await getPostCommentsAndCommentSettings(postSlug);

    return json(getPostResult);
  } catch (error) {
    console.log(error);

    throw new Response('Post not found', { status: 404 });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.post.title,
    },
  ];
};

export default function Post() {
  const loaderData = useLoaderData<typeof loader>();
  const { post, comments, commentSettings } = loaderData;

  return <PostPage post={post} comments={comments} commentSettings={commentSettings} />;
}
