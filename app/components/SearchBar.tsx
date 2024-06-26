import { Flex, Input, Button, Stack } from '@chakra-ui/react';
import { Form } from '@remix-run/react';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!query.trim()) {
      e.preventDefault(); // Prevent form submission if the query is empty or contains only spaces
    }
  };

  return (
    <Flex display="flex" p={0} m={0}>
      <Form method="get" action="/search" style={{ width: '20em', margin: 0, padding: 0 }} onSubmit={handleSubmit}>
        <Stack
          direction="row"
          w="100%"
          gap="0"
          backgroundColor="white"
          borderRadius="10px"
          borderWidth="2px"
          _focusWithin={{ borderColor: 'secondary' }}
          _hover={{ borderColor: 'secondary' }}
          p={0}
          m={0}
        >
          <Input
            type="search"
            color="text"
            name="query"
            placeholder="Search..."
            borderEndRadius="0"
            border="none"
            backgroundColor="white"
            focusBorderColor="transparent"
            textColor="gray.700"
            fontSize="sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            color="text2"
            background="none"
            border="none"
            fontSize="md"
            borderStartRadius="0"
            _hover={{
              background: 'primary',
              color: 'background',
            }}
            _focus={{
              boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
            }}
            p={0}
            m={0}
          >
            <FaSearch />
          </Button>
        </Stack>
      </Form>
    </Flex>
  );
}
