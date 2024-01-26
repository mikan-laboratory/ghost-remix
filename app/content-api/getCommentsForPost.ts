//Please Note: The Member API documentation is not public as the ghost team doesn't expect it to be stable. As a result, errors may occur in the future if they change anything.

import axios from 'axios';

const siteUrl = 'http://localhost:2368';

export const getCommentsForPost = async (postId: string) => {
  try {
    const response = await axios.get(`${siteUrl}/members/api/comments/`, {
      params: { post_id: postId },
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching comments:', err);
    throw err;
  }
};
