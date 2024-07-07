import { Box, Text } from '@chakra-ui/react';
import { useRouteLoaderData } from '@remix-run/react';
import Comment from './Comment';
import CommentBox from './CommentBox';
import { BasicMember } from '~/types/member';
import { JsonifiedPostPageProps } from './types';

export default function CommentsList({ comments }: Pick<JsonifiedPostPageProps, 'comments'>) {
  const loaderData = useRouteLoaderData<{ member: BasicMember | null }>('root');
  const member = loaderData?.member || null;

  const validComments = comments.filter((comment) => !comment.parent_id);

  return (
    <Box display="flex" flexDirection="column" borderTopWidth="1px" borderTopColor="secondary" alignItems="center">
      <Text fontSize={{ base: '3xl', sm: '4xl' }} py={5} w="100%" textAlign="center" color="primary">
        Join the Discussion ({comments.length})
      </Text>
      <Box display="flex" alignItems="center" justifyContent="center" pb={5} px={5}>
        <Text w="100%" color="text1">
          {`Welcome to the discussion of this post! Here in the comments section, we value your thoughts and encourage you
          to share them with us. We believe in fostering a positive and respectful environment where everyone can feel
          comfortable to express themselves. Remember, your words have the power to inspire and enlighten. Let's make
          this a space where kindness and constructive feedback thrive. Dive in, contribute your insights, and let's
          grow together in this engaging and supportive community!`}
        </Text>
      </Box>
      <CommentBox member={member} />
      {validComments.map((comment) => (
        <Comment key={comment.id} comment={comment} member={member} />
      ))}
      {comments.length === 0 && (
        <Box>
          <Text color="white">Be the first to start a conversation!</Text>
        </Box>
      )}
    </Box>
  );
}
