import { Box } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <Box py={3} borderTop="2px solid" w="100%" display="flex" justifyContent="center">
      <Box textColor="text2" fontSize="small" display="flex" w="auto" alignItems="center" gap={1}>
        Powered by
        <a href="https://www.github.com/mikan-laboratory" target="_blank">
          <Box display="flex" gap={2} alignItems="center" textColor="primary" sx={{ _hover: { color: 'secondary' } }}>
            GhostRemix
            <FaGithub />
          </Box>
        </a>
      </Box>
    </Box>
  );
}
