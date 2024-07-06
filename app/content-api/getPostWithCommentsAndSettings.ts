import { GetPostAndComments } from '~/components/types';
import { getCommentsForPost } from './getCommentsForPost';
import { getShowRapidRead } from './getShowRapidRead';
import { getSettingsValue } from './getSettingsValue';
import { getPost } from './getPost';

export const getPostWithCommentsAndSettings = async (slug: string): Promise<GetPostAndComments> => {
  const post = await getPost({
    slug,
    status: 'published',
  });
  const commentSettings = await getSettingsValue({ key: 'comments_enabled', defaultValue: 'off' });
  const showRapidRead = await getShowRapidRead(post.type);

  return {
    post,
    comments: commentSettings === 'off' ? [] : await getCommentsForPost(post.id),
    commentSettings,
    showRapidRead,
  };
};
