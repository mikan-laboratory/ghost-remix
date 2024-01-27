import React from 'react';
import { Button, Box, Textarea, Input } from '@chakra-ui/react';

interface CommentBoxProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onPostComment: (comment: string) => void;
}

export default function CommentBox({ isLoggedIn, onLogin, onPostComment }: CommentBoxProps) {
  const [comment, setComment] = React.useState('');

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  if (!isLoggedIn) {
    return (
      <Box my={4}>
        <Button onClick={onLogin}>Log In to Comment</Button>
      </Box>
    );
  }

  return (
    <Box display="flex" my={4} alignItems="center">
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
      <Button colorScheme="blue" onClick={() => onPostComment(comment)} isDisabled={!comment}>
        Comment
      </Button>
    </Box>
  );
}
