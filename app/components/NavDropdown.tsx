import { Box, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from '@remix-run/react';
import { Params } from '@remix-run/react';

interface NavDropdownProps {
  pages?: { title: string; slug: string }[];
  params: Readonly<Params<string>>;
}

export default function NavDropdown({ pages, params }: NavDropdownProps) {
  return (
    <Menu>
      <MenuButton
        textAlign="center"
        fontWeight="bold"
        color="primary"
        borderBottom="3px solid"
        borderColor="transparent"
        sx={{ _hover: { color: 'tertiary2' } }}
        display="flex"
        flexDirection="row"
      >
        <Box display="flex" alignItems="center">
          <div>More</div>
          <FaChevronDown />
        </Box>
      </MenuButton>
      <MenuList>
        {pages?.map((page) => (
          <MenuItem key={page.slug}>
            <Link to={`/${page.slug}`}>
              <Box
                textAlign="center"
                borderBottom="3px solid"
                borderColor={params.postSlug === page.slug ? 'tertiary2' : 'transparent'}
                sx={{ _hover: { color: 'tertiary2' } }}
              >
                {page.title}
              </Box>
            </Link>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
