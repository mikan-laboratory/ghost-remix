//External Library Imports
import { Button, Box } from '@chakra-ui/react';

interface EngagementLogInProps {
  onLogin: () => void;
}

export default function EngagementLogin({ onLogin }: EngagementLogInProps) {
  return (
    <Box my={4}>
      <Button onClick={onLogin}>Log In to Comment, Like, and Reply</Button>
    </Box>
  );
}
