//External Library Imports
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { Link, useNavigate, useRouteLoaderData } from '@remix-run/react';
//Internal Module Imports
import SearchBar from './SearchBar';
import { BasicMember } from '~/types/member';

export default function Header() {
  const navigate = useNavigate();
  const loaderData = useRouteLoaderData<{ member: BasicMember | null }>('root');
  const member = loaderData?.member;
  const blogTitle = 'BLOG TITLE';

  const login = (): void => navigate('/members');
  const logout = async (): Promise<void> => {
    await fetch('/logout', { method: 'POST' });
    navigate('/', { replace: true });
  };

  return (
    <Box w="100%">
      <Flex flexDirection="row" justifyContent="space-between">
        <Link to="/">
          <Heading mb={4} color="primary" sx={{ _hover: { color: 'text1' } }}>
            {blogTitle}
          </Heading>
        </Link>
        {member && (
          <Heading color="text2" mb={4}>
            Welcome, {member.name}
          </Heading>
        )}
        {member ? (
          <Button onClick={logout} bg="primary" color="text1">
            Sign Out
          </Button>
        ) : (
          <Button
            onClick={login}
            bg="background"
            color="primary"
            border="solid"
            borderColor="primary"
            sx={{
              ':hover': {
                bg: 'primary',
                borderColor: 'primary',
                color: 'text1',
              },
            }}
          >
            Sign In
          </Button>
        )}
      </Flex>
      <SearchBar />
    </Box>
  );
}
