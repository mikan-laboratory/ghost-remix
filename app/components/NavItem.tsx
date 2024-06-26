import { Link } from '@remix-run/react';
import { Box } from '@chakra-ui/react';

interface NavItemProps {
  destination: string;
  title: string;
  pathname: string;
  type: string;
}

export default function NavItem({ destination, title, pathname, type }: NavItemProps) {
  return (
    <Link key={title} to={'/' + destination}>
      <Box
        display={{ base: type === 'main' ? 'none' : 'unset', md: 'unset' }}
        fontSize={type === 'main' ? 'inherit' : '2xl'}
        textAlign={type === 'main' ? 'center' : 'left'}
        borderBottom={type === 'main' ? '3px solid' : ''}
        borderLeft={type === 'dropdown' ? '3px solid' : ''}
        color={type === 'main' ? 'inherit' : 'white'}
        pl={type === 'dropdown' ? 5 : ''}
        borderColor={pathname === '/' + destination ? 'tertiary2' : 'transparent'}
        sx={{
          _hover: {
            color: type === 'main' ? 'tertiary2' : 'primary',
            bg: type === 'main' ? 'inherit' : 'background',
            border: type === 'main' ? 'inherit' : 'none',
          },
        }}
      >
        {title}
      </Box>
    </Link>
  );
}
