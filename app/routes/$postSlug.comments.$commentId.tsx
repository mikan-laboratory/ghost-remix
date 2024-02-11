import { ActionFunction, json, redirect } from '@remix-run/node';
import { authenticateCookie } from '~/authenticateCookie.server';
import { prisma } from '~/db.server';

export const action: ActionFunction = async ({ request, params }) => {
  try {
    const postSlug = params.postSlug;
    const commentId = params.commentId;

    if (!postSlug || !commentId) {
      throw new Error('Not Found');
    }

    if (request.method !== 'DELETE') {
      throw new Error('Invalid request');
    }

    const maybeMember = await authenticateCookie(request);

    if (!maybeMember.member) {
      throw new Error('Unauthorized');
    }

    await prisma.comments.delete({
      where: { id: commentId, member_id: maybeMember.member.id },
    });

    return redirect(`/${postSlug}`);
  } catch (error) {
    console.error(error);

    return json({ error: (error as Error).message }, { status: 400 });
  }
};
