import { useState, useEffect } from 'react';
import { MetaFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { getPostsAndPagination } from '~/content-api/getPostsAndPagination';
import PaginationNavigation from '~/components/PaginationNavigation';
import { getBasicBlogInfo } from '~/getBasicBlogInfo.server';
import { PageBase } from '~/components/PageBase';
import BlogList from '~/components/BlogList';
import cachified from '@epic-web/cachified';
import { FIVE_MINUTES_IN_MILLISECONDS } from '~/constants';
import { getCache } from '~/getCache.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  const getData = async () => {
    const [bodyPosts, blogInfo] = await Promise.all([getPostsAndPagination(page, 12), getBasicBlogInfo()]);

    return {
      bodyPosts: bodyPosts.posts,
      totalPages: bodyPosts.totalPages,
      ...blogInfo,
    };
  };

  const noCache = request.headers.get('Cache-Control') === 'no-cache';

  const data = await cachified({
    key: `blog:page-${page}`,
    cache: getCache(),
    getFreshValue: async () => getData(),
    staleWhileRevalidate: FIVE_MINUTES_IN_MILLISECONDS,
    forceFresh: noCache,
  });

  return json(data);
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
