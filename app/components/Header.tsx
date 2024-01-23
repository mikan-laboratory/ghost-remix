import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { Link, useNavigate, useRouteLoaderData } from '@remix-run/react';
import SearchBar from './SearchBar';

export default function Header() {
  const navigate = useNavigate();
  const { member } = useRouteLoaderData('root');

  return (
    <Box w="100%">
      <Flex>
        <Link to="/">
          <Heading mb={4} color="primary" sx={{ _hover: { color: 'text1' } }}>
            Tech Bro Lifestyle
          </Heading>
          {member && <Heading mb={4}>Welcome, {member.name}</Heading>}
        </Link>
      </Flex>
      <SearchBar />
      {member ? (
        <Button onClick={() => fetch('/logout', { method: 'POST' })}>Sign Out</Button>
      ) : (
        <Button onClick={() => navigate('/members')}>Sign In</Button>
      )}
    </Box>
  );
}
