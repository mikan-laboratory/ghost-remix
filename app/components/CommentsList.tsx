//External Library Imports
import { Box, Text } from '@chakra-ui/react';
import { Prisma, PrismaClient } from '@prisma/client';
import { useFetcher, useNavigate, useRouteLoaderData } from '@remix-run/react';

//Internal Module Imports
import Comments from './Comments';
import CommentBox from './CommentBox';
import { BasicMember } from '~/types/member';

type CommentWithRelations = Prisma.commentsGetPayload<{
  include: {
    comment_likes: true;
    comment_reports: true;
    members: true;
    other_comments: true;
  };
}>;

interface CommentsProps {
  comments: CommentWithRelations[];
  postId: string;
  postSlug: string;
}

export default function CommentsList({ comments, postId, postSlug }: CommentsProps) {
  const loaderData = useRouteLoaderData<{ member: BasicMember | null }>('root');
  const member = loaderData?.member || null;

  const validComments = Array.isArray(comments) ? comments : [];

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/members');
  };

  const fetcher = useFetcher();

  const handlePostComment = (comment: string) => {
    if (!member) return;
    fetcher.submit(
      { actionType: 'postComment', comment, postId: postId, memberId: member.id },
      { method: 'post', action: `/${postSlug}` },
    );
  };

  const handleDeleteComment = (commentId: string) => {
    fetcher.submit({ actionType: 'deleteComment', commentId }, { method: 'post', action: `/${postSlug}` });
  };

  return (
    <Box display="flex" flexDirection="column" borderTopWidth="1px" borderTopColor="secondary" alignItems="center">
      <Text fontSize={{ base: '3xl', sm: '4xl' }} py={5} w="100%" textAlign="center">
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
      <CommentBox member={member} onLogin={handleLogin} onPostComment={handlePostComment} />
      {validComments.length && (
        <Comments validComments={validComments} member={member} onDeleteComment={handleDeleteComment} />
      )}
      {!validComments.length && (
        <Box>
          <Text>Be the first to start a conversation!</Text>
        </Box>
      )}
    </Box>
  );
}
