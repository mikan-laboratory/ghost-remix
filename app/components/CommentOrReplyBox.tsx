//External Library Imports
import React from 'react';
import { Button, Box, Input, Alert, AlertIcon } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
//Internal Module Imports
import { BasicMember } from '~/types/member';
import useCommentActions from '~/hooks/useCommentOrReplyActions';

interface CommentBoxProps {
  member: BasicMember | null;
  postId: string;
  postSlug: string;
  type: string;
}

export default function CommentOrReplyBox({ member, postId, postSlug, type }: CommentBoxProps) {
  const [commentOrReply, setCommentOrReply] = React.useState('');
  const { postCommentOrReply, isProcessing, error } = useCommentActions(postSlug);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      setErrorMessage('An error occuered while processing your request.');
    }
  }, [error]);

  const handleCommentOrReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentOrReply(event.target.value);
  };

  const handlePostAndClear = (commentText: string) => {
    if (!member?.id) return;
    postCommentOrReply(postId, commentText, type);
    setCommentOrReply('');
  };

  return (
    <Box display="flex" my={4} alignItems="center" w="100%" flexDirection={{ base: 'column', sm: 'row' }} gap={2}>
      {errorMessage && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {errorMessage}
        </Alert>
      )}
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
