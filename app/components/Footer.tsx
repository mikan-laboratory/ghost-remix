import { Box, Image, Flex, Text, Link } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box as="footer" backgroundColor="primary" w="100%">
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent="space-between"
        py={3}
        px={{ base: 4, sm: 6 }}
      >
        <Flex alignItems="center" color="text3" mb={{ base: 2, sm: 0 }}>
          <Image src="/logo.webp" height="56px" width="56px" objectFit="contain" mr={2} />
        </Flex>

        <Flex alignItems="center" fontSize="xs">
          <Text color="text3" mr={1}>
            Powered by
          </Text>
          <Link
            href="https://ghostremix.com"
            target="_blank"
            color="text3"
            _hover={{ color: 'secondary' }}
            display="flex"
            alignItems="center"
          >
            GhostRemix
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}
