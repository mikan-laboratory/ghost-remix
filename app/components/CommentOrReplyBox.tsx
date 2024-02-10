//External Library Imports
import React from 'react';
import { Button, Box, Input } from '@chakra-ui/react';
//Internal Module Imports
import { BasicMember } from '~/types/member';

interface CommentBoxProps {
  member: BasicMember | null;
  postId: string;
  postSlug: string;
  type: string;
}

export default function CommentOrReplyBox({ member, postId, postSlug, type }: CommentBoxProps) {
  const [commentOrReply, setCommentOrReply] = React.useState('');

  const handleCommentOrReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentOrReply(event.target.value);
  };

  const handlePostAndClear = (commentText: string) => {
    if (!member?.id) return;

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
          setCommentOrReply('');
          window.location.reload();
        } else {
          console.error(`Failed to post the ${type}`);
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
        value={commentOrReply}
        onChange={handleCommentOrReplyChange}
        flex={1}
        mr={2}
      />
      <Button
        colorScheme="blue"
        onClick={() => handlePostAndClear(commentOrReply)}
        isDisabled={!commentOrReply}
        w={{ base: '100%', sm: 'unset' }}
      >
        {type === 'comment' ? 'Comment' : 'Reply'}
      </Button>
    </Box>
  );
}
