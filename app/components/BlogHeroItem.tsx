//External Library Imports
import dayjs from 'dayjs';
import { Box, Flex, Square, Text, Image } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import { PostOrPage } from '@tryghost/content-api';

interface BlogListItemProps {
  post?: PostOrPage;
}

export default function BlogHeroItem({ post }: BlogListItemProps) {
  if (!post) {
    // Render nothing or a placeholder if no post is provided
    return null; // or <div>Loading...</div>
  }
  const time = post.published_at ? new Date(post.published_at).toLocaleTimeString() : 'Sometime';
  console.log(post);

  return (
    <Box display="flex" flexDirection="row" gap={4}>
      {post.feature_image && (
        <Box position="relative" minWidth="60%" height="0" paddingBottom="35%" overflow="hidden" borderRadius="xl">
          <Image
            src={post.feature_image}
            alt={post.feature_image_alt || 'image'}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            minWidth="100%"
            minHeight="100%"
            objectFit="cover"
          />
        </Box>
      )}
      <Box display="flex" flexDirection="column">
        <div>{post.published_at ? dayjs(post.published_at).format('MMMM DD, YYYY') : 'Some Date'}</div>
        <Link to={`/${post.slug}`}>
          <Text fontSize="4xl" fontWeight="bolder" textColor="primary" sx={{ _hover: { color: 'secondary' } }}>
            {post.title}
          </Text>
        </Link>
        <Text mt={2} textColor="text2">
          {post.excerpt}...
        </Text>
        {post?.tags?.[0] && <div>{post.tags[0].name}</div>}
      </Box>
    </Box>
  );
}
