import { Flex, Button, Spacer, Box, Text, useToast, useUpdateEffect, Tooltip } from '@chakra-ui/react';
import { useParams, useFetcher } from '@remix-run/react';
import { formatDistanceToNow } from 'date-fns';
import { useCallback, useState } from 'react';
import { FaThumbsUp, FaTrash } from 'react-icons/fa';
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

  const handleLikeComment = useCallback(async () => {
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
    <Flex justifyContent="space-between" alignItems="start" w="100%">
      <Flex align="center">
        <Box ml={3}>
          <Text
            fontWeight="bold"
            color="text1"
            display={{ base: 'flex', md: 'unset' }}
            flexDirection={{ base: 'column' }}
          >
            {comment.member_id === member?.id ? 'You' : comment.members?.name ? comment.members.name : 'Anonymous'}
            <Text as="span" fontWeight="normal" color="text2" ml={{ base: 0, md: 4 }}>
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </Text>
          </Text>
          <Box dangerouslySetInnerHTML={{ __html: comment.html || '<></>' }} mt={2} color="text1"></Box>
        </Box>
      </Flex>
      <Flex align="center">
        <Tooltip label={member ? '' : 'Log In to Like'} hasArrow>
          <Button
            size="sm"
            leftIcon={<FaThumbsUp />}
            variant="ghost"
            color={isLiked ? 'secondary' : 'primary'}
            onClick={handleLikeComment}
            isDisabled={!member}
          >
            {comment.comment_likes.length} likes
          </Button>
        </Tooltip>
        {comment.member_id === member?.id && (
          <Button colorScheme="red" onClick={handleDeleteComment}>
            <FaTrash />
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
