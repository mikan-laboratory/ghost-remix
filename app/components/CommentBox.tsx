//External Library Imports
import { Button, Box, Input, useToast, useUpdateEffect } from '@chakra-ui/react';
//Internal Module Imports
import { BasicMember } from '~/types/member';
import { useFetcher, useNavigate, useParams } from '@remix-run/react';

interface CommentBoxProps {
  member: BasicMember | null;
  parentId?: string;
}

export default function CommentBox({ member, parentId }: CommentBoxProps): JSX.Element {
  const params = useParams();
  const postSlug = params.postSlug;

  const navigate = useNavigate();
  const handleLogin = (): void => {
    navigate('/members');
  };

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

  if (!member) {
    return (
      <Box my={4}>
        <Button onClick={handleLogin}>Log In to Comment, Like, or Reply</Button>
      </Box>
    );
  }

  const isDisabled = fetcher.state !== 'idle';

  return (
    <Box w="100%" my={4} alignItems="center">
      <fetcher.Form method="post" action={`/${postSlug}/comments/`} preventScrollReset>
        <Box display="flex" w="100%" flexDirection={{ base: 'column', sm: 'row' }} gap={2}>
          <Input
            name="comment"
            borderRadius="lg"
            border="solid"
            borderWidth="2px"
            borderColor="secondary"
            placeholder={parentId ? 'Reply to this comment' : 'Write a comment'}
            flex={1}
            mr={2}
          />
          <Button colorScheme="blue" type="submit" isDisabled={isDisabled} w={{ base: '100%', sm: 'unset' }}>
            {parentId ? 'Reply' : 'Comment'}
          </Button>
          {parentId && <Input type="hidden" name="parentId" value={parentId} />}
        </Box>
      </fetcher.Form>
    </Box>
  );
}
