import { useState } from 'react';

const useCommentActions = (postSlug: string) => {
  const [isProcessing, setIsProcessing] = useState(false);

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
        console.error('Network error:', error);
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

  return { deleteComment, toggleLikeComment, isProcessing };
};

export default useCommentActions;
