import { Box, Image } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <Box backgroundColor="primary" w="100%" display="flex" flexDirection="column" alignItems="center">
      <Box py={12} width="100%" alignItems="flex-end" justifyContent="flex-start" px={12} color="text3" display="flex">
        <Image src="/logo.png" height={14} width={14} />
        <span>© 2024</span>
      </Box>
      <Box
        textColor="text1"
        fontSize="small"
        display="flex"
        w="100%"
        textAlign="center"
        justifyContent="center"
        gap={1}
        backgroundColor="secondary"
      >
        Powered by
        <a href="https://ghostremix.com" target="_blank">
          <Box display="flex" gap={2} alignItems="center" textColor="text1" sx={{ _hover: { color: 'secondary' } }}>
            GhostRemix
          </Box>
        </a>
      </Box>
    </Box>
  );
}
