import { GetPostAndComments } from '~/components/types';
import { getCommentSettings } from './getCommentSettings';
import { getCommentsForPost } from './getCommentsForPost';
import { getPost } from './getPost';

export const getPostCommentsAndCommentSettings = async (slug: string): Promise<GetPostAndComments> => {
  const post = await getPost(slug);
  const commentSettings = await getCommentSettings();

  return {
    post,
    comments: commentSettings === 'off' ? [] : await getCommentsForPost(post.id),
    commentSettings,
  };
};
