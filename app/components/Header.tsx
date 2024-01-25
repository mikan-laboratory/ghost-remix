import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { Link, useNavigate, useRouteLoaderData } from '@remix-run/react';
import SearchBar from './SearchBar';
import { BasicMember } from '~/types/member';

export default function Header() {
  const navigate = useNavigate();
  const loaderData = useRouteLoaderData<{ member: BasicMember | null }>('root');
  const member = loaderData?.member;

  const login = (): void => navigate('/members');
  const logout = async (): Promise<void> => {
    await fetch('/logout', { method: 'POST' });
    navigate('/', { replace: true });
  };

  return (
    <Box w="100%">
      <Flex>
        <Link to="/">
          <Heading mb={4} color="primary" sx={{ _hover: { color: 'text1' } }}>
            SITE TITLE
          </Heading>
          {member && <Heading mb={4}>Welcome, {member.name}</Heading>}
        </Link>
      </Flex>
      <SearchBar />
      {member ? <Button onClick={logout}>Sign Out</Button> : <Button onClick={login}>Sign In</Button>}
    </Box>
  );
}
