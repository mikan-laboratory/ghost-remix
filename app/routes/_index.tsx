import { Box } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import { MetaFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getPostsAndPagination } from '~/content-api/getPostsAndPagination';
import { getBasicBlogInfo } from '~/getBasicBlogInfo.server';
import { PageBase } from '~/components/PageBase';
import BlogHero from '~/components/BlogHero';
import BlogList from '~/components/BlogList';
import cachified from '@epic-web/cachified';
import { FIVE_MINUTES, ONE_HOUR } from '~/constants';
import { getCache } from '~/getCache.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const getData = async () => {
    const [heroPosts, posts1, posts2, blogInfo] = await Promise.all([
      getPostsAndPagination(1, 3),
      getPostsAndPagination(2, 3),
      getPostsAndPagination(2 + 1, 3),
      getBasicBlogInfo(),
    ]);

    return {
      heroPosts: heroPosts.posts,
      bodyPosts: [...posts1.posts, ...posts2.posts],
      totalPages: heroPosts.totalPages,
      ...blogInfo,
    };
  };

  const noCache = request.headers.get('Cache-Control') === 'no-cache';

  const data = await cachified({
    key: 'home',
    ttl: FIVE_MINUTES,
    cache: getCache(),
    getFreshValue: async () => getData(),
    staleWhileRevalidate: ONE_HOUR,
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

export default function Index() {
  const { heroPosts, bodyPosts, postCount } = useLoaderData<typeof loader>();

  const heroPostCount = heroPosts.length;
  const bodyPostCount = bodyPosts.length;
  const homePostCount = heroPostCount + bodyPostCount;

  const hasHeroPosts = heroPostCount > 0;
  const hasBodyPosts = bodyPostCount > 0;
  const hasPosts = hasHeroPosts || hasBodyPosts;

  const showLoadMode = postCount > homePostCount;

  return (
    <PageBase>
      {!hasPosts && <Box>No posts yet</Box>}
      {hasHeroPosts && <BlogHero posts={heroPosts} />}
      {hasBodyPosts && <BlogList posts={bodyPosts} />}
      {showLoadMode && (
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
