import { json, MetaFunction, LoaderFunctionArgs, TypedResponse } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { PostPage } from '~/components/PostPage';
import { GetPreviewPostAndComments } from '~/components/types';
import { getPreviewPost } from '~/content-api/getPreviewPost';

export const loader = async ({ params }: LoaderFunctionArgs): Promise<TypedResponse<GetPreviewPostAndComments>> => {
  try {
    const postSlug = params.postSlug;

    if (!postSlug) {
      throw new Error('Post not found');
    }

    const post = await getPreviewPost(postSlug);

    return json({ post, comments: [], commentSettings: 'off' });
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
  const { post, comments, commentSettings } = loaderData;

  return <PostPage key={post.id} post={post} comments={comments} commentSettings={commentSettings} />;
}
