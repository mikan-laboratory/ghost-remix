import { json, MetaFunction, LoaderFunctionArgs, TypedResponse } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { PostPage } from '~/components/PostPage';
import { GetPostAndComments } from '~/components/types';
import { getPost } from '~/content-api/getPost';
import { getShowRapidRead } from '~/content-api/getShowRapidRead';

export const loader = async ({ params }: LoaderFunctionArgs): Promise<TypedResponse<GetPostAndComments>> => {
  try {
    const postSlug = params.postSlug;

    if (!postSlug) {
      throw new Error('Post not found');
    }

    const post = await getPost({
      uuid: postSlug,
      status: 'draft',
    });
    const showRapidRead = await getShowRapidRead(post.type);

    return json({ post, comments: [], commentSettings: 'off', showRapidRead });
  } catch (error) {
    console.error(error);
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

export default function PreviewPost() {
  const loaderData = useLoaderData<typeof loader>();
  const { post, comments, commentSettings, showRapidRead } = loaderData;

  return (
    <PostPage
      key={post.id}
      post={post}
      comments={comments}
      commentSettings={commentSettings}
      showRapidRead={showRapidRead}
    />
  );
}
