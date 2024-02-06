//External Library Imports
import React from 'react';
import { Button, Box, Input } from '@chakra-ui/react';

//Internal Module Imports
import { BasicMember } from '~/types/member';

interface CommentBoxProps {
  member: BasicMember | null;
  onLogin: () => void;
  onPostComment: (comment: string, memberId: string) => void;
}

export default function CommentBox({ member, onLogin, onPostComment }: CommentBoxProps) {
  const [comment, setComment] = React.useState('');

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  if (!member) {
    return (
      <Box my={4}>
        <Button onClick={onLogin}>Log In to Comment</Button>
      </Box>
    );
  }

  const handlePostAndClear = (commentText: string, memberId: string) => {
    onPostComment(commentText, memberId);
    setComment(''); // Reset comment field after posting
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
        onClick={() => handlePostAndClear(comment, member.id)}
        isDisabled={!comment}
        w={{ base: '100%', sm: 'unset' }}
      >
        Comment
      </Button>
    </Box>
  );
}
