import cachified from '@epic-web/cachified';
import { ActionFunction, TypedResponse, json } from '@remix-run/node';
import { callClaude } from '~/callClaude';
import { SummarizePostResponse } from '~/components/types';
import { FIVE_MINUTES, ONE_HOUR } from '~/constants';
import { getCache } from '~/getCache.server';

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

    const cacheKey = `summarize:${Buffer.from(post as string).toString('base64')}`;

    const result = await cachified({
      key: cacheKey,
      ttl: FIVE_MINUTES,
      staleWhileRevalidate: ONE_HOUR,
      cache: getCache(),
      getFreshValue: async () => {
        const claudeResult = await callClaude(post as string);
        return claudeResult;
      },
    });

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
