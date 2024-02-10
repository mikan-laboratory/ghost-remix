import { useState } from 'react';

const useCommentOrReplyActions = (postSlug: string) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(false);

  const deleteComment = async (commentId: string) => {
    setIsProcessing(true);
    fetch(`/posts/${postSlug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actionType: 'deleteComment',
        commentId: commentId,
        parentId: null,
      }),
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload();
        } else {
          console.error('Failed to delete the comment');
        }
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      });
    setIsProcessing(false);
  };

  const toggleLikeComment = async (commentId: string) => {
    setIsProcessing(true);

    try {
      const response = await fetch(`/posts/${postSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionType: 'toggleLikeComment',
          commentId: commentId,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }

    setIsProcessing(false);
  };

  const postCommentOrReply = (postId: string, commentText: string, type: string) => {
    fetch(`/posts/${postSlug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actionType: 'postCommentOrReply',
        comment: commentText,
        postId: postId,
        parentId: null,
      }),
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload();
        } else {
          console.error(`Failed to post the ${type}`);
        }
      })
      .catch((error) => {
        console.error('Network error:', error);
      });
  };

  return { deleteComment, toggleLikeComment, postCommentOrReply, isProcessing, error };
};

export default useCommentOrReplyActions;
