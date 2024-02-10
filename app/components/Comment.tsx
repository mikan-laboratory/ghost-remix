//External Library Imports
import { Box, Flex, Text, Button, Spacer } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { Prisma, comment_likes as prismaCommentLikes } from '@prisma/client';
import { FaThumbsUp, FaReply } from 'react-icons/fa';
import { useState, useEffect } from 'react';
//Internal Module Imports
import { BasicMember } from '~/types/member';
import ReplyBox from './ReplyBox';

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
  console.log(comment);
  if (comment.parent_id !== parentId) return; //remove replies
  const [isLiked, setIsLiked] = useState(
    comment.comment_likes.some((like: prismaCommentLikes) => like.member_id === member?.id),
  );
  const [likedCount, setLikedCount] = useState(comment.comment_likes.length);
  const [replyActive, setReplyActive] = useState(false);
  const [seeReplies, setSeeReplies] = useState(false);

  const handleDeleteComment = () => {
    fetch(`/posts/${postSlug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actionType: 'deleteComment',
        commentId: comment.id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload();
        } else {
          console.error('Failed to delete the comment');
        }
      })
      .catch((error) => {
        console.error('Network error:', error);
      });
  };

  const handleToggleLikeComment = async () => {
    if (isLiked) {
      const newLikedCount = likedCount - 1;
      setLikedCount(newLikedCount);
      setIsLiked(!isLiked);
    } else {
      const newLikedCount = likedCount + 1;
      setLikedCount(newLikedCount);
      setIsLiked(!isLiked);
    }
    try {
      const response = await fetch(`/posts/${postSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionType: 'toggleLikeComment',
          commentId: comment.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
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
          <Button colorScheme="red" onClick={() => handleDeleteComment()}>
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
      {replyActive && <ReplyBox member={member} postId={comment.post_id} postSlug={postSlug} commentId={comment.id} />}
      <Box>
        {comment.other_comments.length > 0 && (
          <Button onClick={() => handleSeeRepliesClick()} variant="link">
            {seeReplies ? 'Hide Replies' : 'See Replies'}
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
