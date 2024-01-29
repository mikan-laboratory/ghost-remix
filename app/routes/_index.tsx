// External library imports
import { useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { PostOrPage } from '@tryghost/content-api';

// Internal module imports
import { getPostsAndPagination } from '~/content-api/getPostsAndPagination';
import Header from '~/components/Header';
import PaginationNavigation from '~/components/PaginationNavigation';
import BlogListItem from '~/components/BlogListItem';

export const meta: MetaFunction = () => {
  return [{ title: 'TITLE' }, { name: 'description', content: 'description' }];
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
    <Box px="100px" py="5%" minHeight="100vh" backgroundColor="background">
      <Header />
      <VStack spacing={0}>
        {posts.map((post: PostOrPage) => (
          <BlogListItem key={post.id} post={post} />
        ))}
      </VStack>
      <PaginationNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </Box>
  );
}
