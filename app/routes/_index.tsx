import { Box, Heading, Input, Button, Image, Text, Flex, VStack } from '@chakra-ui/react';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getPosts } from '~/content-api/getPosts';

export const meta: MetaFunction = () => {
  return [{ title: 'The Tech Brolog' }, { name: 'description', content: 'Welcome to Tech!' }];
};

export const loader = async () => {
  return getPosts();
};

function getDayOfWeek(dateString: string): string {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateString);
  return daysOfWeek[date.getDay()];
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return 'Unknown Date'; // Return a default or placeholder string
  }

  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, add 1
  const day = date.getDate().toString().padStart(2, '0');

  return `${month}-${day}-${year}`;
}

export default function Index() {
  const posts = useLoaderData<typeof loader>();

  return (
    <Box p={5}>
      <Heading mb={4}>Tech Bro Lifestyle</Heading>
      <Flex mb={6}>
        <Input placeholder="Search blog posts" />
        <Button ml={2}>Search</Button>
      </Flex>

      {/* List of Blog Posts */}
      <VStack spacing={5}>
        {posts.map((post) => {
          console.log(post);
          return (
            <Box key={post.id} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} w="full">
              <Text fontSize="4xl">{post.published_at ? `${getDayOfWeek(post.published_at)}` : 'Someday'}</Text>
              <Text>
                {formatDate(post.published_at)} · {post.authors?.[0]?.name ?? 'Anonymous'}
              </Text>
              {post.feature_image && (
                <Image
                  src={post.feature_image}
                  alt={post.feature_image_alt || 'image'}
                  mt={2}
                  width="50%"
                  height="auto"
                />
              )}
              <Heading size="md" mt={2} fontStyle="italic">
                {post.title}
              </Heading>
              <Text mt={2}>{post.excerpt}</Text>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
