//External Library Imports
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useMediaQuery,
} from '@chakra-ui/react';
import { Link, useNavigate, useRouteLoaderData } from '@remix-run/react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
//Internal Module Imports
import SearchBar from './SearchBar';
import { RootLoaderData } from '~/types/root';

export default function Header() {
  const navigate = useNavigate();
  const loaderData = useRouteLoaderData<RootLoaderData>('root');

  const member = loaderData?.member;
  const blogTitle = loaderData?.title ?? 'Blog';
  const pages = loaderData?.pages ?? [];

  const [isSmallScreen] = useMediaQuery('(max-width: 600px)');
  const [isLargeScreen] = useMediaQuery('(min-width: 992px)');

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
        <HStack>
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
          {pages.length > 0 && (
            <Menu>
              <MenuButton as={Button}>Menu</MenuButton>
              <MenuList>
                {pages.map((page) => (
                  <MenuItem key={page.slug}>
                    <Link to={`/${page.slug}`}>{page.title}</Link>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Flex>
      <SearchBar />
    </Box>
  );
}
