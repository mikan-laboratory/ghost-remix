import { Flex, Box, Text, useToast, useUpdateEffect, Image, IconButton } from '@chakra-ui/react';
import { useParams, useFetcher } from '@remix-run/react';
import { formatDistanceToNow } from 'date-fns';
import { FaTrash } from 'react-icons/fa';
import { CommentInnerProps } from './types';

export const CommentInner = ({ comment, member }: CommentInnerProps): JSX.Element => {
  const commentId = comment.id;

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

  return (
    <Flex alignItems="start" w="100%" gap={2} backgroundColor="comment" py="12px" borderRadius="lg">
      <Image
        src="/logo.png"
        height={12}
        width={12}
        backgroundColor="background"
        borderRadius="100%"
        padding="1px"
        position="relative"
        top="-22px"
        left="-22px"
      />
      <Flex align="center">
        <Box ml={-3}>
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
        {comment.member_id === member?.id && (
          <IconButton
            isRound={true}
            size={'sm'}
            aria-label="Delete"
            icon={<FaTrash />}
            colorScheme="red"
            onClick={handleDeleteComment}
          />
        )}
      </Flex>
    </Flex>
  );
};
