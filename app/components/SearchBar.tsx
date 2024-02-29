//External Library Imports
import { Flex, Input, Button, Stack, useMediaQuery } from '@chakra-ui/react';
import { Form } from '@remix-run/react';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isSmallScreen] = useMediaQuery('(max-width: 600px)');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!query.trim()) {
      e.preventDefault(); // Prevent form submission if the query is empty or contains only spaces
    }
  };

  return (
    <Flex>
      <Form method="get" action="/search" style={{ width: '20em' }} onSubmit={handleSubmit}>
        <Stack direction="row" w="100%" gap="0">
          <Input
            type="search"
            name="query"
            placeholder="Search..."
            borderColor="primary"
            borderEndRadius="0"
            borderWidth="2px"
            _hover={{ borderColor: 'secondary' }}
            focusBorderColor="secondary"
            textColor="gray.700"
            fontSize="md"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            background="primary"
            textColor="background"
            borderColor="primary"
            borderWidth="2px"
            borderLeft="0px"
            fontSize="md"
            borderStartRadius="0"
            _hover={{
              background: 'background',
              color: 'primary',
            }}
            _focus={{
              boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
            }}
          >
            <FaSearch />
          </Button>
        </Stack>
      </Form>
    </Flex>
  );
}
