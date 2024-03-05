//External Library Imports
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useMediaQuery,
  Image,
} from '@chakra-ui/react';
import { Link, useNavigate, useRouteLoaderData, useParams } from '@remix-run/react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';
//Internal Module Imports
import SearchBar from './SearchBar';
import { RootLoaderData } from '~/types/root';

export default function Header() {
  const navigate = useNavigate();
  const loaderData = useRouteLoaderData<RootLoaderData>('root');
  const params = useParams();

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
    <Box w="100%" py={10}>
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
          <Box display="flex" gap={2}>
            {pages.map((page) => (
              <Link key={page.slug} to={`/${page.slug}`}>
                <Box
                  fontSize="smaller"
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
        <SearchBar />
        <HStack>
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
    </Box>
  );
}

{
  /* {member && isLargeScreen && (
          <Heading color="text2" mb={4}>
            Welcome, {member.name}
          </Heading>
        )} */
}

{
  /* {pages.length > 0 && (
            <Menu>
              <MenuButton as={IconButton} aria-label="Options" icon={<MdMenu />} />{' '}
              <MenuList>
                {pages.map((page) => (
                  <Link key={page.slug} to={`/${page.slug}`}>
                    <MenuItem sx={{ _hover: { color: 'primary' } }}>{page.title}</MenuItem>
                  </Link>
                ))}
              </MenuList>
            </Menu>
          )} */
}
