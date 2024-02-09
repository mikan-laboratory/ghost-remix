//External Library Imports
import { Box, Flex, Text, Button, Spacer } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { Prisma, comment_likes as prismaCommentLikes } from '@prisma/client';
import { FaThumbsUp, FaReply } from 'react-icons/fa';
import { useState, useEffect } from 'react';
//Internal Module Imports
import { BasicMember } from '~/types/member';

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
}

export default function Comment({ comment, member, postSlug }: CommentProps) {
  const [isLiked, setIsLiked] = useState(
    comment.comment_likes.some((like: prismaCommentLikes) => like.member_id === member?.id),
  );
  const [likedCount, setLikedCount] = useState(comment.comment_likes.length);

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

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mb={4} borderColor="primary" w="100%">
      <Flex justifyContent="space-between" w="100%">
        <Flex align="center">
          <Box ml={3}>
            <Text fontWeight="bold">
              {comment.members?.name ? comment.members.name : 'Anonymous'}
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
        {/* reply button here */}
        <Spacer />
        <Text fontSize="sm" color="gray.500">
          {likedCount} likes
        </Text>
      </Flex>
      {/* replies here */}
    </Box>
  );
}

/* 

       
        <Button size="sm" leftIcon={<FaReply />} variant="ghost" ml={2} color="text1">
          Reply
        </Button>


      {comment.other_comments.length > 0 && (
        <Box mt={4} pl={8} borderLeftWidth="1px">
          need to figure out replies
          <Comments validComments={comment.other_comments} member={member} />
        </Box>
      )} 
      */
