// External library imports
import { useState } from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { PostOrPage } from '@tryghost/content-api';

// Internal module imports
import { getSearchResults } from '~/content-api/getSearchResults';
import Header from '~/components/Header';
import PaginationNavigation from '~/components/PaginationNavigation';
import BlogListItem from '~/components/BlogListItem';

export const meta: MetaFunction = () => {
  return [{ title: 'Tech Bro Lifestyle' }, { name: 'description', content: 'Welcome to Tech!' }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const query = url.searchParams.get('query') || '';

  return getSearchResults(query, page, 5);
};

export default function Index() {
  const { posts, totalPages, totalPosts } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const currentSearchQuery = searchParams.get('query');

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    navigate(`/search?query=${currentSearchQuery}&page=${newPage}`);
  };

  return (
    <Box px="100px" py="5%" minHeight="100vh" backgroundColor="background">
      <Header />
      <VStack spacing={0}>
        {posts.length > 0 && posts.map((post: PostOrPage) => <BlogListItem key={post.id} post={post} />)}
        {posts.length === 0 && (
          <Box>
            <Text textColor="text1">There don't seem to be any results.</Text>
          </Box>
        )}
      </VStack>
      <PaginationNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </Box>
  );
}
