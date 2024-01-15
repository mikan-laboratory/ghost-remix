import { Flex, Input, Button, Stack } from '@chakra-ui/react';
import { Form } from '@remix-run/react';

export default function SearchBar() {
  return (
    <Flex mb={6} w="100%">
      <Form method="get" action="/search" style={{ width: '100%' }}>
        <Stack direction="row" spacing={2} w="100%">
          <Input
            type="search"
            name="query"
            placeholder="Search blog posts"
            borderColor="secondary"
            textColor="text1"
            focusBorderColor="primary"
          />
          <Button
            type="submit"
            ml={2}
            background="secondary"
            textColor="text1"
            border="solid"
            borderColor="secondary"
            sx={{
              ':hover': {
                bg: 'background',
                borderColor: 'primary',
                color: 'primary',
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
