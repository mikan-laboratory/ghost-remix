import { Box, Flex, Heading } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <Box w="100%">
      <Flex>
        <Link to="/">
          <Heading mb={4} color="primary" sx={{ _hover: { color: 'text1' } }}>
            Tech Bro Lifestyle
          </Heading>
        </Link>
      </Flex>
      <SearchBar />
    </Box>
  );
}
