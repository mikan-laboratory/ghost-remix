//External Library Imports
import { useLoaderData } from '@remix-run/react';
import { json, MetaFunction, LoaderFunctionArgs, TypedResponse, ActionFunction } from '@remix-run/node';
// Internal Module Imports
import { PostPage } from '~/components/PostPage';
import { getPostCommentsAndCommentSettings } from '~/content-api/getPostAndComments';
import { GetPostAndComments } from '~/components/types';
import axios, { AxiosResponse } from 'axios';
import { SummarizePostResponse } from '~/components/types';
import { env } from '~/env';

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

export const action: ActionFunction = async ({ request }): Promise<TypedResponse<SummarizePostResponse>> => {
  try {
    const body = await request.formData();
    const post = body.get('post');

    if (!post) {
      throw new Error('Empty post');
    }

    if (request.method !== 'POST') {
      throw new Error('Invalid Request');
    }

    const modelURL = env.LLM_URL;

    if (!modelURL) {
      throw new Error('Model URL not set');
    }

    const token = env.LLM_API_KEY;

    if (!token) {
      throw new Error('Model API key not set');
    }

    const response: AxiosResponse<{
      result: string;
    }> = await axios.post(modelURL, {
      command: 'summarize',
      text: post,
      token,
    });

    return json(response.data);
  } catch (error) {
    console.error(error);

    return json(
      {
        error: (error as Error).message,
      },
      {
        status: 400,
      },
    );
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
