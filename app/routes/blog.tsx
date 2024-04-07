// External library imports
import { useState, useEffect } from 'react';
import { MetaFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
// Internal module imports
import { getPostsAndPagination } from '~/content-api/getPostsAndPagination';
import PaginationNavigation from '~/components/PaginationNavigation';
import { getBasicBlogInfo } from '~/getBasicBlogInfo.server';
import { PageBase } from '~/components/PageBase';
import BlogList from '~/components/BlogList';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Parse the current page from the URL query parameters
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  // Fetch posts and pagination data for the current page
  const bodyPosts = await getPostsAndPagination(page, 12);
  const blogInfo = await getBasicBlogInfo();

  return json({
    bodyPosts: bodyPosts.posts,
    totalPages: bodyPosts.totalPages,
    ...blogInfo,
  });
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

export default function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const { bodyPosts, totalPages } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    //Find and set current page of posts based on URL params
    const url = new URL(window.location.href);
    const initialPage = parseInt(url.searchParams.get('page') || '1', 10);
    setCurrentPage(initialPage);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    navigate(`/blog/?page=${newPage}`);
  };

  return (
    <PageBase>
      <BlogList posts={bodyPosts} />
      <PaginationNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </PageBase>
  );
}
