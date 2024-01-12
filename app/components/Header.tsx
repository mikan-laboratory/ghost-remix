import { Box, Input, Button, Flex, Heading } from '@chakra-ui/react';
import { Link } from '@remix-run/react';

export default function Header() {
  return (
    <Box>
      <Flex>
        <Link to="/">
          <Heading mb={4} color="primary" sx={{ _hover: { color: 'text1' } }}>
            Tech Bro Lifestyle
          </Heading>
        </Link>
      </Flex>
      <Flex mb={6}>
        <Input placeholder="Search blog posts" borderColor="secondary" textColor="text1" focusBorderColor="primary" />
        <Button
          ml={2}
          background="secondary"
          textColor="text1"
          border="solid"
          borderColor="secondary"
          sx={{
            ':hover': {
              bg: 'background',
              borderColor: 'primary',
              color: 'primary',
            },
          }}
        >
          Search
        </Button>
      </Flex>
    </Box>
  );
}
