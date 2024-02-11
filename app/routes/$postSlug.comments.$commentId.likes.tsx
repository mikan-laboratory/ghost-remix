import { ActionFunction, redirect, json } from '@remix-run/node';
import { authenticateCookie } from '~/authenticateCookie.server';
import { likeComment } from './likeComment';
import { unlikeComment } from './unlikeComment';

export const action: ActionFunction = async ({ request, params }) => {
  try {
    const postSlug = params.postSlug;
    const commentId = params.commentId;

    if (!postSlug || !commentId) {
      throw new Error('Not Found');
    }

    const maybeMember = await authenticateCookie(request);

    if (!maybeMember.member) {
      throw new Error('Unauthorized');
    }

    const member = maybeMember.member;

    switch (request.method) {
      case 'POST':
        await likeComment({ commentId, member });
        break;
      case 'DELETE':
        await unlikeComment({ commentId, member });
        break;
      default:
        throw new Error('Invalid request');
    }

    return redirect(`/${postSlug}`);
  } catch (error) {
    console.error(error);

    return json({ error: (error as Error).message }, { status: 400 });
  }
};
