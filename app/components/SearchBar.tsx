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
      <Form method="get" action="/search" style={{ width: '24em' }} onSubmit={handleSubmit}>
        <Stack direction="row" w="100%" gap="0">
          <Input
            type="search"
            name="query"
            placeholder="Search..."
            borderColor="secondary"
            borderEndRadius="0"
            borderWidth="2px"
            // borderRight="none"
            textColor="text1"
            fontSize="smaller"
            focusBorderColor="primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            background="background"
            textColor="secondary"
            border="solid 2px"
            borderStartRadius="0"
            borderLeft="none"
            borderColor="secondary"
            sx={{
              ':hover': {
                bg: 'secondary',
                borderColor: 'secondary',
                color: 'text1',
              },
            }}
          >
            <FaSearch />
          </Button>
        </Stack>
      </Form>
    </Flex>
  );
}
