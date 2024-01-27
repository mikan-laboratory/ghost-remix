import { Box, Text } from '@chakra-ui/react';
import Comments from './Comments';
import CommentBox from './CommentBox';

interface Comment {
  id: string;
  status: string;
  html: string;
  created_at: string;
  edited_at: string | null;
  member: any; //i need to fix this later
  replies: Comment[];
  liked: boolean;
  count: {
    replies: number;
    likes: number;
  }; // Replace with the correct type if known
}

interface CommentsProps {
  comments: Comment[];
}

export default function CommentsList({ comments }: CommentsProps) {
  const validComments = Array.isArray(comments) ? comments : [];

  //writeacomment testing login
  const isLoggedIn = false;

  const handleLogin = () => {
    console.log('log in!');
  };

  const handlePostComment = (comment: string) => {
    console.log(comment);
  };
  //testing logic ends

  return (
    <Box display="flex" flexDirection="column" borderTopWidth="1px" borderTopColor="secondary">
      <Text fontSize="4xl" py={5} w="100%" textAlign="center">
        Join the Discussion ({validComments.length})
      </Text>
      <Box display="flex" alignItems="center" justifyContent="center" pb={5}>
        <Text w="100%">
          Welcome to the discussion of this post! Here in the comments section, we value your thoughts and encourage you
          to share them with us. We believe in fostering a positive and respectful environment where everyone can feel
          comfortable to express themselves. Remember, your words have the power to inspire and enlighten. Let's make
          this a space where kindness and constructive feedback thrive. Dive in, contribute your insights, and let's
          grow together in this engaging and supportive community!
        </Text>
      </Box>
      <CommentBox isLoggedIn={isLoggedIn} onLogin={handleLogin} onPostComment={handlePostComment} />
      {validComments.length && <Comments validComments={validComments} />}
      {!validComments.length && (
        <Box>
          <Text>Be the first to start a conversation!</Text>
        </Box>
      )}
    </Box>
  );
}
