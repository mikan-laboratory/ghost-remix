import { Box, Button, Flex, HStack, useMediaQuery, Image, Wrap } from '@chakra-ui/react';
import { Link, useNavigate, useRouteLoaderData, useParams, useLocation } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';
import SearchBar from './SearchBar';
import { RootLoaderData } from '~/types/root';
import NavItem from './NavItem';
import NavDropdown from './NavDropdown';

interface HeaderProps {
  hideSignup?: boolean;
}

export default function Header({ hideSignup = false }: HeaderProps) {
  const navigate = useNavigate();
  const loaderData = useRouteLoaderData<RootLoaderData>('root');
  const params = useParams();
  const location = useLocation();
  const [viewMenu, setViewMenu] = useState(false);
  const [isSmallScreen] = useMediaQuery('(max-width: 768px)', {
    ssr: true,
    fallback: true,
  });
  const [isMediumScreen] = useMediaQuery('(max-width: 1024px)', {
    ssr: true,
    fallback: false,
  });
  const member = loaderData?.member;
  const blogTitle = loaderData?.title ?? 'Blog';
  const signupEnabled = loaderData?.signupEnabled ?? false;
  const pages = loaderData?.pages ?? [];

  const signInComponent: JSX.Element | undefined = useMemo(() => {
    if (hideSignup) return undefined;

    const login = (): void => navigate('/members');
    const logout = async (): Promise<void> => {
      await fetch('/logout', { method: 'POST' });
      navigate('/', { replace: true });
    };

    if (member) {
      return (
        <Button
          onClick={logout}
          color="white"
          backgroundColor={'tertiary'}
          sx={{
            ':hover': {
              bg: 'tertiary2',
            },
          }}
        >
          {isSmallScreen ? <FaSignOutAlt /> : 'Sign Out'}
        </Button>
      );
    }

    if (signupEnabled) {
      return (
        <Button
          onClick={login}
          color="white"
          backgroundColor={'tertiary'}
          sx={{
            ':hover': {
              bg: 'tertiary2',
            },
          }}
        >
          {isSmallScreen ? <FaSignInAlt /> : 'Sign In'}
        </Button>
      );
    }

    return undefined;
  }, [hideSignup, member, signupEnabled, isSmallScreen, navigate]);

  return (
    <Box w="100%" py={{ base: 2, md: 10 }} px="5">
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" gap={2}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" minWidth="50%">
          <Link to="/">
            <Flex display="flex" alignItems="center">
              <Image src="/logo.webp" height="56px" width="56px" objectFit="contain" />
              <Box
                width={32}
                fontSize={blogTitle.length > 7 ? 'larger' : 'xx-large'}
                color="primary"
                lineHeight="100%"
                sx={{ _hover: { color: 'tertiary2' } }}
              >
                {blogTitle}
              </Box>
            </Flex>
          </Link>
          <Wrap>
            <NavItem destination="" title="Home" pathname={location.pathname} type="main" />
            <NavItem destination="blog" title="Blog" pathname={location.pathname} type="main" />
            {!isMediumScreen && pages.length > 0 && (
              <>
                {pages.slice(0, 3).map((page) => (
                  <NavItem
                    key={page.slug}
                    destination={page.slug}
                    title={page.title}
                    pathname={location.pathname}
                    type="main"
                  />
                ))}
                {pages.length > 3 && <NavDropdown pages={pages.slice(3)} params={params} />}
              </>
            )}
            {!isSmallScreen && isMediumScreen && pages.length > 0 && <NavDropdown pages={pages} params={params} />}
          </Wrap>
        </Box>
        <Box display={{ base: 'none', md: 'block' }}>
          <SearchBar />
        </Box>
        <HStack>
          {pages.length > 0 && (
            <Button
              display={{ base: 'unset', md: 'none' }}
              color={viewMenu ? 'primary' : 'white'}
              backgroundColor={viewMenu ? 'secondary' : 'primary'}
              onClick={() => setViewMenu(!viewMenu)}
              sx={{
                ':hover': {
                  bg: 'secondary',
                },
              }}
            >
              <MdMenu />
            </Button>
          )}
          {signInComponent}
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
        <Box display={{ base: 'block', md: 'none' }}>
          <SearchBar />
        </Box>
      </Box>
    </Box>
  );
}
