//External Library Imports
import React from 'react';
import { Button, Box, Input } from '@chakra-ui/react';
//Internal Module Imports
import { BasicMember } from '~/types/member';

interface ReplyBoxProps {
  member: BasicMember | null;
  postId: string;
  postSlug: string;
  commentId: string;
}

export default function ReplyBox({ member, postId, postSlug, commentId }: ReplyBoxProps) {
  const [reply, setReply] = React.useState('');

  const handleReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReply(event.target.value);
  };

  const handlePostAndClear = (commentText: string) => {
    if (!member?.id) return;

    fetch(`/posts/${postSlug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actionType: 'postReply',
        comment: commentText,
        postId: postId,
        parentId: commentId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setReply('');
          window.location.reload();
        } else {
          console.error('Failed to post the reply');
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
        value={reply}
        onChange={handleReplyChange}
        flex={1}
        mr={2}
      />
      <Button
        colorScheme="blue"
        onClick={() => handlePostAndClear(reply)}
        isDisabled={!reply}
        w={{ base: '100%', sm: 'unset' }}
      >
        Reply
      </Button>
    </Box>
  );
}
