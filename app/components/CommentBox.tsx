//External Library Imports
import React from 'react';
import { Button, Box, Input } from '@chakra-ui/react';
//Internal Module Imports
import { BasicMember } from '~/types/member';

interface CommentBoxProps {
  member: BasicMember | null;
  onLogin: () => void;
  postId: string;
  postSlug: string;
}

export default function CommentBox({ member, onLogin, postId, postSlug }: CommentBoxProps) {
  const [comment, setComment] = React.useState('');

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  if (!member) {
    return (
      <Box my={4}>
        <Button onClick={onLogin}>Log In to Comment, Like, and Reply</Button>
      </Box>
    );
  }

  const handlePostAndClear = (commentText: string) => {
    if (!member.id) return;

    fetch(`/posts/${postSlug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actionType: 'postComment',
        comment: commentText,
        postId: postId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setComment('');
          window.location.reload();
        } else {
          console.error('Failed to post the comment');
        }
      })
      .catch((error) => {
        console.error('Network error:', error);
      });
  };

  return (
    <Box display="flex" my={4} alignItems="center" w="100%" flexDirection={{ base: 'column', sm: 'row' }} gap={2}>
      <Input
        borderRadius="lg"
        border="solid"
        borderWidth="2px"
        borderColor="secondary"
        placeholder="Write a comment..."
        value={comment}
        onChange={handleCommentChange}
        flex={1}
        mr={2}
      />
      <Button
        colorScheme="blue"
        onClick={() => handlePostAndClear(comment)}
        isDisabled={!comment}
        w={{ base: '100%', sm: 'unset' }}
      >
        Comment
      </Button>
    </Box>
  );
}
