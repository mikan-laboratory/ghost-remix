//External Library Imports
import { Box, Flex, Text, Button, Spacer } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { Prisma, comment_likes as prismaCommentLikes } from '@prisma/client';
import { FaThumbsUp, FaReply } from 'react-icons/fa';
import { useState, useEffect } from 'react';
//Internal Module Imports
import { BasicMember } from '~/types/member';
import CommentOrReplyBox from './CommentOrReplyBox';
import useCommentActions from '~/hooks/useCommentOrReplyActions';

type CommentWithRelations = Prisma.commentsGetPayload<{
  include: {
    comment_likes: true;
    comment_reports: true;
    members: true;
    other_comments: true;
  };
}>;

interface CommentProps {
  comment: CommentWithRelations;
  member: BasicMember | null;
  postSlug: string;
  parentId: string | null;
  comments: CommentWithRelations[];
}

export default function Comment({ comment, member, postSlug, parentId, comments }: CommentProps) {
  if (comment.parent_id !== parentId) return; //remove replies
  const [isLiked, setIsLiked] = useState(
    comment.comment_likes.some((like: prismaCommentLikes) => like.member_id === member?.id),
  );
  const [likedCount, setLikedCount] = useState(comment.comment_likes.length);
  const [replyActive, setReplyActive] = useState(false);
  const [seeReplies, setSeeReplies] = useState(false);

  const { deleteComment, toggleLikeComment, isProcessing } = useCommentActions(postSlug);

  const handleDeleteComment = () => {
    deleteComment(comment.id);
  };

  const handleToggleLikeComment = async () => {
    //optimistic UI update
    if (isLiked) {
      const newLikedCount = likedCount - 1;
      setLikedCount(newLikedCount);
      setIsLiked(!isLiked);
    } else {
      const newLikedCount = likedCount + 1;
      setLikedCount(newLikedCount);
      setIsLiked(!isLiked);
    }
    toggleLikeComment(comment.id);
  };

  const handleReplyClick = () => {
    setReplyActive(!replyActive);
  };

  const handleSeeRepliesClick = () => {
    setSeeReplies(!seeReplies);
  };

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      mb={4}
      borderColor="primary"
      w="100%"
      gap={2}
      display="flex"
      flexDirection="column"
    >
      <Flex justifyContent="space-between" w="100%">
        <Flex align="center">
          <Box ml={3}>
            <Text fontWeight="bold">
              {comment.members?.name === member?.name
                ? 'You'
                : comment.members?.name
                ? comment.members.name
                : 'Anonymous'}
              <Text as="span" fontWeight="normal" color="gray.500" ml={2}>
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </Text>
            </Text>
            <Box dangerouslySetInnerHTML={{ __html: comment.html || '<></>' }} mt={2}></Box>
          </Box>
        </Flex>
        {comment.member_id === member?.id && (
          <Button colorScheme="red" onClick={() => handleDeleteComment(comment.id)}>
            Delete
          </Button>
        )}
      </Flex>
      <Flex mt={2} align="center">
        <Button
          size="sm"
          leftIcon={<FaThumbsUp />}
          variant="ghost"
          color={isLiked ? 'secondary' : 'primary'}
          onClick={() => handleToggleLikeComment()}
          isDisabled={!member}
        >
          Like
        </Button>
        <Button
          size="sm"
          leftIcon={<FaReply />}
          variant="ghost"
          ml={2}
          color={replyActive ? 'secondary' : 'primary'}
          onClick={() => handleReplyClick()}
        >
          Reply
        </Button>
        <Spacer />
        <Text fontSize="sm" color="gray.500">
          {likedCount} likes
        </Text>
      </Flex>
      {replyActive && <CommentOrReplyBox member={member} postId={comment.post_id} postSlug={postSlug} type="reply" />}
      <Box>
        {comment.other_comments.length > 0 && (
          <Button onClick={() => handleSeeRepliesClick()} variant="link">
            {seeReplies
              ? 'Hide Replies'
              : comment.other_comments.length === 1
              ? 'See 1 reply'
              : `See ${comment.other_comments.length} Replies`}
          </Button>
        )}
        {comment.other_comments.length > 0 &&
          seeReplies &&
          comment.other_comments.map((oc: CommentWithRelations) => (
            <Comment
              comment={(() => {
                const foundComment = comments.find((comment) => comment.id === oc.id);
                return foundComment;
              })()}
              member={member}
              postSlug={postSlug}
              parentId={comment.id}
              comments={comments}
            />
          ))}
      </Box>
    </Box>
  );
}
