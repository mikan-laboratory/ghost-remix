//External Library Imports
import { Box, Text } from '@chakra-ui/react';
import { useNavigate, useRouteLoaderData } from '@remix-run/react';
//Internal Module Imports
import Comment from './Comment';
import CommentOrReplyBox from './CommentOrReplyBox';
import EngagementLogin from './EngagementLogIn';
import { BasicMember } from '~/types/member';
import { CommentWithRelations } from './types';

interface CommentsProps {
  comments: CommentWithRelations[];
  postId: string;
  postSlug: string;
}

export default function CommentsList({ comments, postId, postSlug }: CommentsProps) {
  const loaderData = useRouteLoaderData<{ member: BasicMember | null }>('root');
  const member = loaderData?.member || null;

  const navigate = useNavigate();

  const handleLogin = (): void => {
    navigate('/members');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderTopWidth="1px"
      borderTopColor="secondary"
      alignItems="center"
      color="text1"
    >
      <Text fontSize={{ base: '3xl', sm: '4xl' }} py={5} w="100%" textAlign="center">
        Join the Discussion ({comments.length})
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
      {!member && <EngagementLogin onLogin={handleLogin} />}
      {member && <CommentOrReplyBox member={member} postId={postId} postSlug={postSlug} type="comment" />}
      {comments.length > 0 &&
        comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            member={member}
            postSlug={postSlug}
            parentId={null}
            comments={comments}
          />
        ))}
      {comments.length === 0 && (
        <Box>
          <Text>Be the first to start a conversation!</Text>
        </Box>
      )}
    </Box>
  );
}
