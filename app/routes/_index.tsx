// External library imports
import { useState, useEffect } from 'react';
import { VStack } from '@chakra-ui/react';
import { MetaFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { PostOrPage } from '@tryghost/content-api';
// Internal module imports
import { getPostsAndPagination } from '~/content-api/getPostsAndPagination';
import PaginationNavigation from '~/components/PaginationNavigation';
import { getBasicBlogInfo } from '~/getBasicBlogInfo.server';
import { PageBase } from '~/components/PageBase';
import BlogHero from '~/components/BlogHero';
import BlogList from '~/components/BlogList';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Parse the current page from the URL query parameters
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  // Fetch posts and pagination data for the current page
  const heroPosts = await getPostsAndPagination(1, 3);
  const posts1 = await getPostsAndPagination(page * 2, 3);
  const posts2 = await getPostsAndPagination(page * 2 + 1, 3);
  const blogInfo = await getBasicBlogInfo();

  return json({
    heroPosts: heroPosts.posts,
    bodyPosts: [...posts1.posts, ...posts2.posts],
    totalPages: heroPosts.totalPages,
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

export default function Index() {
  const [currentPage, setCurrentPage] = useState(1);
  const { heroPosts, bodyPosts, totalPages } = useLoaderData<typeof loader>();
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
      <BlogHero posts={heroPosts} />
      <BlogList posts={bodyPosts} />
      <PaginationNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </PageBase>
  );
}
