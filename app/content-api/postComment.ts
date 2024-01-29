import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const postComment = async (postId: string, memberId: string, commentHtml: string) => {
  try {
    // Create a new comment
    const newComment = await prisma.comments.create({
      data: {
        id: uuidv4(),
        post_id: postId,
        member_id: memberId, // This should be the ID of the member making the comment
        html: commentHtml,
        created_at: new Date(),
        updated_at: new Date(),
        // If there are any other required fields in your comments model, add them here
      },
    });
    console.log('New Comment Created', newComment);
    return newComment;
  } catch (err) {
    console.error('Error posting a new comment:', err);
    throw err;
  }
};
