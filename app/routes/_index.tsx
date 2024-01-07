// External library imports
import { useState } from 'react';
import { Box, Heading, Input, Button, Flex, VStack } from '@chakra-ui/react';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';

// Internal module imports
import colors from '~/theme/colors';
import { Post } from '~/types/blogTypes';
import { getPostsAndPagination } from '~/content-api/getPostsAndPagination';
import PaginationNavigation from '~/components/PaginationNavigation';
import BlogListItem from '~/components/BlogListItem';

export const meta: MetaFunction = () => {
  return [{ title: 'Tech Bro Lifestyle' }, { name: 'description', content: 'Welcome to Tech!' }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  return getPostsAndPagination(page, 5);
};

export default function Index() {
  const { posts, totalPages, totalPosts } = useLoaderData<typeof loader>();

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    navigate(`/?page=${newPage}`);
  };

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
        {posts.map((post: Post) => (
          <BlogListItem key={post.id} post={post} />
        ))}
      </VStack>
      <PaginationNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </Box>
  );
}
