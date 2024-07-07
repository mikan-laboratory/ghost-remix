import { Button, Box, Input, Textarea, useToast, useUpdateEffect } from '@chakra-ui/react';
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
        <Button
          border="2px"
          borderColor="primary"
          borderStartRadius="full"
          borderEndRadius="full"
          onClick={handleLogin}
          backgroundColor="background"
          color="primary"
        >
          Log In to Comment, Like, or Reply
        </Button>
      </Box>
    );
  }

  const isDisabled = fetcher.state !== 'idle';

  return (
    <Box w="100%" my={4} alignItems="center">
      <fetcher.Form method="post" action={`/${postSlug}/comments/`} preventScrollReset>
        <Box display="flex" w="100%" flexDirection={{ base: 'column' }} gap={2} alignItems="end">
          <Textarea
            name="comment"
            borderRadius="xl"
            border="solid"
            borderWidth="2px"
            borderColor="lightgrey"
            backgroundColor="white"
            placeholder={parentId ? 'Reply to this comment...' : 'Add a comment...'}
            flex={1}
            size="sm"
          />
          <Button
            backgroundColor="secondary"
            color="white"
            type="submit"
            isDisabled={isDisabled}
            w={{ base: '100%', sm: 'unset' }}
          >
            {parentId ? 'Reply' : 'Comment'}
          </Button>
          {parentId && <Input type="hidden" name="parentId" value={parentId} />}
        </Box>
      </fetcher.Form>
    </Box>
  );
}
