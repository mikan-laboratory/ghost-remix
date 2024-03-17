// External library imports
import { useState } from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { PostOrPage } from '@tryghost/content-api';
// Internal module imports
import { getSearchResults } from '~/content-api/getSearchResults';
import PaginationNavigation from '~/components/PaginationNavigation';
import BlogItem from '~/components/BlogItem';
import { PostsAndPagination } from '~/content-api/types';
import { PageBase } from '~/components/PageBase';

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

export const loader = async ({ request }: LoaderFunctionArgs): Promise<PostsAndPagination> => {
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
    <PageBase>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} py={8}>
        {posts.length > 0 && posts.map((post: PostOrPage) => <BlogItem key={post.id} post={post} type="list" />)}
        {posts.length === 0 && (
          <Box>
            <Text textColor="text1">Sorry, we couldn't find anything.</Text>
          </Box>
        )}
      </Grid>
      <PaginationNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </PageBase>
  );
}
