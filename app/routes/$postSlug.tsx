import { useLoaderData } from '@remix-run/react';
import { json, MetaFunction, LoaderFunctionArgs, TypedResponse } from '@remix-run/node';
import { PostPage } from '~/components/PostPage';
import { cachified } from '@epic-web/cachified';
import { GetPostAndComments } from '~/components/types';
import { getCache } from '~/getCache.server';
import { FIVE_MINUTES_IN_MILLISECONDS } from '~/constants';
import { getPostWithCommentsAndSettings } from '~/content-api/getPostWithCommentsAndSettings';

export const loader = async ({ request, params }: LoaderFunctionArgs): Promise<TypedResponse<GetPostAndComments>> => {
  try {
    const postSlug = params.postSlug;

    if (!postSlug) {
      throw new Error('Not Found');
    }

    const noCache = request.headers.get('Cache-Control') === 'no-cache';

    const postData = await cachified({
      key: `post:${postSlug}`,

      cache: getCache(),
      getFreshValue: async () => getPostWithCommentsAndSettings(postSlug),
      staleWhileRevalidate: FIVE_MINUTES_IN_MILLISECONDS,
      forceFresh: noCache,
    });

    return json(postData);
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
