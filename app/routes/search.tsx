// External library imports
import { useState } from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { PostOrPage } from '@tryghost/content-api';
// Internal module imports
import { getSearchResults } from '~/content-api/getSearchResults';
import Header from '~/components/Header';
import PaginationNavigation from '~/components/PaginationNavigation';
import BlogListItem from '~/components/BlogListItem';
import Footer from '~/components/Footer';
import { GetSearchResultsOutput } from '~/content-api/types';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Search',
    },
    {
      name: 'description',
      content: 'Search blog content',
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs): Promise<GetSearchResultsOutput> => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const query = url.searchParams.get('query') || '';

  return getSearchResults(query, page, 5);
};

export default function Search() {
  const { posts, totalPages } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const currentSearchQuery = searchParams.get('query');

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    navigate(`/search?query=${currentSearchQuery}&page=${newPage}`);
  };

  return (
    <Box
      minHeight="100vh"
      backgroundColor="background"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      w="100%"
    >
      <Box py="5%" px={{ base: 5, sm: 10 }} maxWidth="70em" width="100%">
        <Header />
        <VStack spacing={0}>
          {posts.length > 0 && posts.map((post: PostOrPage) => <BlogListItem key={post.id} post={post} />)}
          {posts.length === 0 && (
            <Box>
              <Text textColor="text1">Sorry, we couldn't find anything.</Text>
            </Box>
          )}
        </VStack>
        <PaginationNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </Box>
      <Footer />
    </Box>
  );
}
