// External library imports
import { Box } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import { MetaFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
// Internal module imports
import { getPostsAndPagination } from '~/content-api/getPostsAndPagination';
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
  const { heroPosts, bodyPosts } = useLoaderData<typeof loader>();

  const hasHeroPosts = heroPosts.length > 0;
  const hasBodyPosts = bodyPosts.length > 0;
  const hasPosts = hasHeroPosts || hasBodyPosts;

  return (
    <PageBase>
      {!hasPosts && <Box>No posts yet</Box>}
      {hasHeroPosts && <BlogHero posts={heroPosts} />}
      {hasBodyPosts && <BlogList posts={bodyPosts} />}
      {hasBodyPosts && (
        <Box width="100%" display="flex" alignContent="center" justifyContent="center">
          <Link key="blog" to="/blog">
            <Box
              border="4px solid transparent"
              width="353px"
              px="8px"
              borderRadius="md"
              textAlign="center"
              color="text3"
              backgroundColor="primary"
              padding={1}
              sx={{ _hover: { backgroundColor: 'secondary' } }}
            >
              Load More
            </Box>
          </Link>
        </Box>
      )}
    </PageBase>
  );
}
