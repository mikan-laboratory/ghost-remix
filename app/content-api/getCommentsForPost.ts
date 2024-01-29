//Please Note: The Member API documentation is not public as the ghost team doesn't expect it to be stable. As a result, errors may occur in the future if they change anything.

// import axios from 'axios';

// const siteUrl = 'http://localhost:2368';

// export const getCommentsForPost = async (postId: string) => {
//   console.log('Post ID', postId);

//   try {
//     const response = await axios.get(`${siteUrl}/members/api/comments/`, {
//       params: { post_id: postId },
//     });
//     console.log(response.data);
//     return response.data;
//   } catch (err) {
//     console.error('Error fetching comments:', err);
//     throw err;
//   }
// };

//External Library Imports
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCommentsForPost = async (postId: string) => {
  console.log('Post ID', postId);

  try {
    // Fetch comments related to the postId
    const comments = await prisma.comments.findMany({
      where: {
        post_id: postId,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        comment_likes: true,
        comment_reports: true,
        members: true,
        other_comments: true,
      },
    });
    console.log('COMMENTS', comments);
    return comments;
  } catch (err) {
    console.error('Error fetching comments from Prisma:', err);
    throw err;
  }
};
