//External Library Imports
import { Box, Button, Flex, Heading, useMediaQuery } from '@chakra-ui/react';
import { Link, useNavigate, useRouteLoaderData } from '@remix-run/react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

//Internal Module Imports
import SearchBar from './SearchBar';
import { BasicMember } from '~/types/member';

export default function Header() {
  const navigate = useNavigate();
  const loaderData = useRouteLoaderData<{ member: BasicMember | null }>('root');
  const member = loaderData?.member;
  const blogTitle = 'BLOG TITLE';

  const [isSmallScreen] = useMediaQuery('(max-width: 600px)');
  const [isLargeScreen] = useMediaQuery('(max-width: 992px)');

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
        {member && isLargeScreen && (
          <Heading color="text2" mb={4}>
            Welcome, {member.name}
          </Heading>
        )}
        {member ? (
          <Button onClick={logout} bg="primary" color="text1">
            {isSmallScreen ? <FaSignOutAlt /> : 'Sign Out'}
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
            {isSmallScreen ? <FaSignInAlt /> : 'Sign In'}
          </Button>
        )}
      </Flex>
      <SearchBar />
    </Box>
  );
}
