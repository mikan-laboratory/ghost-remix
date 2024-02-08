import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { PostOrPage } from '@tryghost/content-api';
import { PostPage } from '~/components/PostPage';
import { CommentWithRelations } from '~/components/types';
import { getPreviewPost } from '~/getPreviewPost';

export const loader: LoaderFunction = async ({ params }) => {
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
      title: data.post.title,
    },
  ];
};

export default function PreviewPost() {
  const loaderData = useLoaderData<{ post: PostOrPage; comments: CommentWithRelations[]; commentSettings: string }>();
  const { post, comments, commentSettings } = loaderData;

  return <PostPage post={post} comments={comments as any} commentSettings={commentSettings} />;
}
