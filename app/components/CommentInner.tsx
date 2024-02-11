import { Flex, Button, Spacer, Box, Text, useToast, useUpdateEffect } from '@chakra-ui/react';
import { useParams, useFetcher } from '@remix-run/react';
import { formatDistanceToNow } from 'date-fns';
import { useCallback, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { CommentInnerProps } from './types';

export const CommentInner = ({ comment, member }: CommentInnerProps): JSX.Element => {
  const commentId = comment.id;
  const memberLikedComment = Boolean(comment.comment_likes.find((like) => like.member_id === member?.id));

  const [isLiked, setIsLiked] = useState(memberLikedComment);

  const params = useParams();
  const postSlug = params.postSlug;
  const fetcher = useFetcher<{ error: string }>();
  const toast = useToast();

  useUpdateEffect(() => {
    if (!fetcher.data?.error) return;

    toast({
      title: 'Error',
      description: fetcher.data.error,
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  }, [fetcher.data]);

  const handleDeleteComment = (): void => {
    fetcher.submit(
      { commentId },
      { method: 'DELETE', action: `/${postSlug}/comments/${commentId}`, preventScrollReset: true },
    );
  };

  const handleLikeComment = useCallback(() => {
    fetcher.submit(
      { commentId: commentId.toString() },
      {
        method: isLiked ? 'DELETE' : 'POST',
        action: `/${postSlug}/comments/${commentId}/likes`,
        preventScrollReset: true,
      },
    );

    setIsLiked(!isLiked);
  }, [isLiked, commentId, fetcher, postSlug]);

  return (
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
        <Button colorScheme="red" onClick={handleDeleteComment}>
          Delete
        </Button>
      )}
      <Flex mt={2} align="center">
        <Text fontSize="sm" color="gray.500">
          {comment.comment_likes.length} likes
        </Text>
        <Spacer />
        <Button
          size="sm"
          leftIcon={<FaThumbsUp />}
          variant="ghost"
          color={isLiked ? 'secondary' : 'primary'}
          onClick={handleLikeComment}
        >
          Like
        </Button>
      </Flex>
    </Flex>
  );
};
