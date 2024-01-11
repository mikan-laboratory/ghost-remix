import { Box, Input, Button, Flex, Heading } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import colors from '~/theme/colors';

export default function Header() {
  return (
    <Box>
      <Flex>
        <Link to="/">
          <Heading mb={4} color={colors.primary} sx={{ _hover: { color: colors.text1 } }}>
            Tech Bro Lifestyle
          </Heading>
        </Link>
      </Flex>
      <Flex mb={6}>
        <Input
          placeholder="Search blog posts"
          borderColor={colors.secondary}
          textColor={colors.text1}
          focusBorderColor={colors.primary}
        />
        <Button
          ml={2}
          background={colors.secondary}
          textColor={colors.text1}
          border={`solid ${colors.secondary}`}
          sx={{
            ':hover': {
              bg: colors.background,
              borderColor: colors.primary,
              color: colors.primary,
            },
          }}
        >
          Search
        </Button>
      </Flex>
    </Box>
  );
}
