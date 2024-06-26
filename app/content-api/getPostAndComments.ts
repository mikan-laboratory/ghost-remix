import { GetPostAndComments } from '~/components/types';
import { getCommentsForPost } from './getCommentsForPost';
import { getPost } from './getPost';
import { getShowRapidRead } from './getShowRapidRead';
import { getSettingsValue } from './getSettingsValue';

export const getPostCommentsAndCommentSettings = async (slug: string): Promise<GetPostAndComments> => {
  const post = await getPost(slug);
  const commentSettings = await getSettingsValue({ key: 'comments_enabled', defaultValue: 'off' });
  const showRapidRead = await getShowRapidRead(post.type);

  return {
    post,
    comments: commentSettings === 'off' ? [] : await getCommentsForPost(post.id),
    commentSettings,
    showRapidRead,
  };
};
