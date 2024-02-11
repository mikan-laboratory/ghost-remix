import { ActionFunction, json, redirect } from '@remix-run/node';
import ObjectID from 'bson-objectid';
import { authenticateCookie } from '~/authenticateCookie.server';
import { getCommentSettings } from '~/content-api/getCommentSettings';
import { prisma } from '~/db.server';

export const action: ActionFunction = async ({ params, request }) => {
  try {
    if (request.method !== 'POST') {
      throw new Error('Invalid request');
    }

    const postSlug = params.postSlug;

    if (!postSlug) {
      throw new Error('Not Found');
    }

    const post = await prisma.posts.findFirst({
      where: {
        slug: postSlug,
      },
      select: {
        id: true,
      },
    });

    if (!post) {
      throw new Error('Not Found');
    }

    const maybeMember = await authenticateCookie(request);

    if (!maybeMember.member) {
      throw new Error('Unauthorized');
    }

    const commentSettings = await getCommentSettings();

    if (commentSettings === 'off') {
      throw new Error('Comments are disabled');
    }

    const formData = await request.formData();

    const commentHtml = formData.get('comment');
    const parentId = formData.get('parentId');

    if (typeof commentHtml !== 'string') {
      throw new Error('Invalid form data');
    }

    await prisma.comments.create({
      data: {
        id: ObjectID().toHexString(),
        post_id: post.id,
        member_id: maybeMember.member.id,
        html: commentHtml,
        created_at: new Date(),
        updated_at: new Date(),
        ...(typeof parentId === 'string' && { parent_id: parentId }),
      },
    });

    return redirect(`/${postSlug}`);
  } catch (error) {
    console.error(error);

    return json({ error: (error as Error).message }, { status: 400 });
  }
};
