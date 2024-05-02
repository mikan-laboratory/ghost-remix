import { ActionFunction, TypedResponse, json } from '@remix-run/node';
import { callClaude } from '~/callClaude';
import { SummarizePostResponse } from '~/components/types';

export const action: ActionFunction = async ({ request }): Promise<TypedResponse<SummarizePostResponse>> => {
  try {
    if (request.method !== 'POST') {
      throw new Error('Invalid Request');
    }

    const body = await request.formData();
    const post = body.get('post');

    if (!post) {
      throw new Error('Empty post');
    }

    const result = await callClaude(post as string);

    return json({ result });
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
