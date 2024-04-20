//External Library Imports
import { Box, Button, Flex, HStack, useMediaQuery, Image } from '@chakra-ui/react';
import { Link, useNavigate, useRouteLoaderData, useParams, useLocation } from '@remix-run/react';
import { useState } from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';
//Internal Module Imports
import SearchBar from './SearchBar';
import { RootLoaderData } from '~/types/root';

export default function Header() {
  const navigate = useNavigate();
  const loaderData = useRouteLoaderData<RootLoaderData>('root');
  const params = useParams();
  const location = useLocation();

  const [viewMenu, setViewMenu] = useState(false);

  const member = loaderData?.member;
  const blogTitle = loaderData?.title ?? 'Blog';
  const pages = loaderData?.pages ?? [];

  const [isSmallScreen] = useMediaQuery('(max-width: 768px)');

  const login = (): void => navigate('/members');
  const logout = async (): Promise<void> => {
    await fetch('/logout', { method: 'POST' });
    navigate('/', { replace: true });
  };

  return (
    <Box w="100%" py={{ base: 2, md: 10 }} px="5">
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" gap={2}>
        <Link to="/">
          <Flex display="flex" alignItems="center">
            <Image src="/logo.png" height={14} width={14} />
            <Box
              width={32}
              fontSize={blogTitle.length > 7 ? 'larger' : 'xx-large'}
              color="primary"
              lineHeight="100%"
              sx={{ _hover: { color: 'text1' } }}
            >
              {blogTitle}
            </Box>
          </Flex>
        </Link>
        {pages.length > 0 && (
          <Box display={{ base: 'none', md: 'flex' }} gap={2}>
            <Link key="home" to="/">
              <Box
                textAlign="center"
                borderBottom={!params.postSlug && location.pathname === '/' ? '3px solid' : 'none'}
                borderColor="secondary"
              >
                Home
              </Box>
            </Link>
            <Link key="blog" to="/blog">
              <Box
                textAlign="center"
                borderBottom={!params.postSlug && location.pathname === '/blog' ? '3px solid' : 'none'}
                borderColor="secondary"
              >
                Blog
              </Box>
            </Link>
            {pages.map((page) => (
              <Link key={page.slug} to={`/${page.slug}`}>
                <Box
                  textAlign="center"
                  borderBottom={params.postSlug === page.slug ? '3px solid' : 'none'}
                  borderColor="secondary"
                >
                  {page.title}
                </Box>
              </Link>
            ))}
          </Box>
        )}
        {!isSmallScreen && <SearchBar />}
        <HStack>
          {pages.length > 0 && (
            <Button
              display={{ base: 'unset', md: 'none' }}
              color={!viewMenu ? 'white' : 'primary'}
              backgroundColor={viewMenu ? 'white' : 'primary'}
              onClick={() => setViewMenu(!viewMenu)}
            >
              <MdMenu />
            </Button>
          )}
          {member ? (
            <Button onClick={logout} bg="primary" color="text1">
              {isSmallScreen ? <FaSignOutAlt /> : 'Sign Out'}
            </Button>
          ) : (
            <Button
              onClick={login}
              bg="secondary"
              color="background"
              border="solid"
              borderColor="secondary"
              sx={{
                ':hover': {
                  bg: 'background',
                  color: 'secondary',
                },
              }}
            >
              {isSmallScreen ? <FaSignInAlt /> : 'Sign In'}
            </Button>
          )}
        </HStack>
      </Flex>
      <Box
        display={{ base: viewMenu ? 'flex' : 'none', md: 'none' }}
        flexDirection="column"
        minHeight="90vh"
        backgroundColor="primary"
        mt="5"
        px={5}
      >
        <Box height="60vh" display="flex" flexDirection="column" justifyContent="center" gap={5}>
          <Link key="home" to="/">
            <Box
              fontSize="2xl"
              textAlign="left"
              borderLeft={!params.postSlug && location.pathname === '/' ? '3px solid' : 'none'}
              borderColor="secondary"
              color="white"
              pl={5}
            >
              Home
            </Box>
          </Link>
          <Link key="blog" to="/blog">
            <Box
              fontSize="2xl"
              textAlign="left"
              borderLeft={!params.postSlug && location.pathname === '/blog' ? '3px solid' : 'none'}
              borderColor="secondary"
              color="white"
              pl={5}
            >
              Blog
            </Box>
          </Link>
          {pages.length > 0 &&
            pages.map((page) => (
              <Link key={page.slug} to={`/${page.slug}`}>
                <Box
                  fontSize="2xl"
                  textAlign="left"
                  borderLeft={params.postSlug === page.slug ? '3px solid' : 'none'}
                  borderColor="secondary"
                  color="white"
                  pl={5}
                >
                  {page.title}
                </Box>
              </Link>
            ))}
        </Box>
        <SearchBar />
      </Box>
    </Box>
  );
}
