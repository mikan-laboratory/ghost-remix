import { useState } from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';
import type { MetaFunction, LoaderFunctionArgs, TypedResponse } from '@remix-run/node';
import { json, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { PostOrPage } from '@tryghost/content-api';
import { getSearchResults } from '~/content-api/getSearchResults';
import PaginationNavigation from '~/components/PaginationNavigation';
import BlogItem from '~/components/BlogItem';
import { PostsAndPagination } from '~/content-api/types';
import { PageBase } from '~/components/PageBase';
import cachified from '@epic-web/cachified';
import { FIVE_MINUTES, ONE_HOUR } from '~/constants';
import { getCache } from '~/getCache.server';

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

export const loader = async ({ request }: LoaderFunctionArgs): Promise<TypedResponse<PostsAndPagination>> => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const query = url.searchParams.get('query') || '';

  const noCache = request.headers.get('Cache-Control') === 'no-cache';

  const data = await cachified({
    key: `search:query-${query}:page-${page}`,
    ttl: FIVE_MINUTES,
    cache: getCache(),
    getFreshValue: async () => getSearchResults(query, page, 5),
    staleWhileRevalidate: ONE_HOUR,
    forceFresh: noCache,
  });

  return json(data);
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
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} py={8} px={5}>
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
