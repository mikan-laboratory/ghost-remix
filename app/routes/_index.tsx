// External library imports
import { useState, useEffect } from 'react';
import { VStack } from '@chakra-ui/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { PostOrPage } from '@tryghost/content-api';
// Internal module imports
import { getPostsAndPagination } from '~/content-api/getPostsAndPagination';
import PaginationNavigation from '~/components/PaginationNavigation';
import BlogListItem from '~/components/BlogListItem';
import { getBasicBlogInfo } from '~/getBasicBlogInfo.server';
import { BasicBlogInfo } from '~/types/blog';
import { PostsAndPagination } from '~/content-api/types';
import { PageBase } from '~/components/PageBase';

export const loader = async ({ request }: LoaderFunctionArgs): Promise<PostsAndPagination & BasicBlogInfo> => {
  // Parse the current page from the URL query parameters
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  // Fetch posts and pagination data for the current page
  const postsAndPagination = await getPostsAndPagination(page, 5);
  const blogInfo = await getBasicBlogInfo();

  return { ...postsAndPagination, ...blogInfo };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
    {
      name: 'description',
      content: data?.description,
    },
  ];
};

export default function Index() {
  const [currentPage, setCurrentPage] = useState(1);
  const { posts, totalPages } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    //Find and set current page of posts based on URL params
    const url = new URL(window.location.href);
    const initialPage = parseInt(url.searchParams.get('page') || '1', 10);
    setCurrentPage(initialPage);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    navigate(`/?page=${newPage}`);
  };

  return (
    <PageBase>
      <VStack spacing={0}>
        {posts.map((post: PostOrPage) => (
          <BlogListItem key={post.id} post={post} />
        ))}
      </VStack>
      <PaginationNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </PageBase>
  );
}
