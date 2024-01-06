import dayjs from 'dayjs';
import colors from '~/theme/colors';
import { Box, Heading, Input, Button, Image, Text, Flex, VStack, Circle } from '@chakra-ui/react';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getPostsAndPagination } from '~/content-api/getPostsAndPagination';

export const meta: MetaFunction = () => {
  return [{ title: 'The Tech Brolog' }, { name: 'description', content: 'Welcome to Tech!' }];
};

export const loader = async () => {
  return getPostsAndPagination();
};

export default function Index() {
  const { posts, totalPages, totalPosts } = useLoaderData<typeof loader>();

  return (
    <Box p={5} backgroundColor={colors.background}>
      <Heading mb={4} color={colors.primary}>
        Tech Bro Lifestyle
      </Heading>
      <Flex mb={6}>
        <Input
          placeholder="Search blog posts"
          borderColor={colors.secondary}
          textColor={colors.text1}
          focusBorderColor={colors.primary}
        />
        <Button
          ml={2}
          background={colors.secondary}
          textColor={colors.text1}
          border={`solid ${colors.secondary}`}
          sx={{
            ':hover': {
              bg: colors.background,
              borderColor: colors.primary,
              color: colors.primary,
            },
          }}
        >
          Search
        </Button>
      </Flex>

      <VStack spacing={0}>
        {posts.map((post) => {
          console.log(post);
          let time = post.published_at ? new Date(post.published_at).toLocaleTimeString() : 0;
          return (
            <Box key={post.id} borderLeft={`2px solid ${colors.secondary}`} overflow="hidden" p={0} pb={10} w="full">
              <Flex alignItems="center">
                <Circle size="20px" bg={colors.secondary} position="absolute" left="11px" />

                <Text fontSize="4xl" fontWeight="bolder" ml={4} textColor={colors.primary}>
                  {post.published_at ? `${dayjs(post.published_at).format('dddd')}` : 'Someday'}
                </Text>
              </Flex>
              <Text borderBottom={`2px solid ${colors.secondary}`} width="50%" pl={5} pb={1} textColor={colors.text2}>
                {dayjs(post.published_at).format('MM-DD-YY')} - {time} - {post.authors?.[0]?.name ?? 'Anonymous'}
              </Text>
              {post.feature_image && (
                <Image
                  src={post.feature_image}
                  alt={post.feature_image_alt || 'image'}
                  mt={5}
                  ml={5}
                  borderRadius="xl"
                  width="50%"
                  height="auto"
                />
              )}
              <Heading size="md" mt={2} ml={5} fontStyle="italic" textColor={colors.text1}>
                {post.title}
              </Heading>
              <Text mt={2} ml={5} textColor={colors.text2}>
                {post.excerpt}
              </Text>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
