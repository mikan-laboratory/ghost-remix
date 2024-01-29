//External Library Imports
import { Flex, Input, Button, Stack } from '@chakra-ui/react';
import { Form } from '@remix-run/react';
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!query.trim()) {
      e.preventDefault(); // Prevent form submission if the query is empty or contains only spaces
    }
  };

  return (
    <Flex mb={6} w="100%">
      <Form method="get" action="/search" style={{ width: '100%' }} onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} w="100%">
          <Input
            type="search"
            name="query"
            placeholder="Search blog posts by title or tag"
            borderColor="secondary"
            textColor="text1"
            focusBorderColor="primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            ml={2}
            background="background"
            textColor="secondary"
            border="solid"
            borderColor="secondary"
            sx={{
              ':hover': {
                bg: 'secondary',
                borderColor: 'secondary',
                color: 'text1',
              },
            }}
          >
            Search
          </Button>
        </Stack>
      </Form>
    </Flex>
  );
}
