// External library imports
import { useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';

// Internal module imports
import { Post } from '~/types/blogTypes';
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

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    navigate(`/?page=${newPage}`);
  };

  return (
    <Box px="100px" py="5%" backgroundColor="background">
      <Header />
      <VStack spacing={0}>
        {posts.map((post: Post) => (
          <BlogListItem key={post.id} post={post} />
        ))}
      </VStack>
      <PaginationNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </Box>
  );
}
