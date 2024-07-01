import cachified from '@epic-web/cachified';
import { ActionFunction, TypedResponse, json } from '@remix-run/node';
import { callClaude } from '~/callClaude';
import { SummarizePostResponse } from '~/components/types';
import { FIVE_MINUTES, ONE_HOUR } from '~/constants';
import { getShowRapidRead } from '~/content-api/getShowRapidRead';
import { prisma } from '~/db.server';
import { getCache } from '~/getCache.server';

export const action: ActionFunction = async ({ request }): Promise<TypedResponse<SummarizePostResponse>> => {
  try {
    if (request.method !== 'POST') {
      throw new Error('Invalid Request');
    }

    const body = await request.formData();
    const postId = body.get('postId') as string | undefined;

    if (!postId) {
      throw new Error('Invalid request');
    }

    const post = await prisma.posts.findFirstOrThrow({
      where: {
        id: {
          equals: postId,
        },
      },
      select: {
        type: true,
        html: true,
      },
    });

    const shouldShowRapidRead = getShowRapidRead(post.type);

    if (!shouldShowRapidRead) {
      throw new Error('Invalid request');
    }

    const postBody = post.html;

    if (!postBody) {
      throw new Error('Empty post');
    }

    const cacheKey = `summarize:${postId}`;

    const result = await cachified({
      key: cacheKey,
      ttl: FIVE_MINUTES,
      staleWhileRevalidate: ONE_HOUR,
      cache: getCache(),
      getFreshValue: async () => {
        const claudeResult = await callClaude(postBody);
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
