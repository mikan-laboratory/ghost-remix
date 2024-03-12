//External Library Imports
import dayjs from 'dayjs';
import { Box, Flex, Square, Text, Image } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import { PostOrPage } from '@tryghost/content-api';

interface BlogListItemProps {
  post?: PostOrPage;
  type: string;
}

export default function BlogHeroItem({ post, type }: BlogListItemProps) {
  if (!post) {
    // Render nothing or a placeholder if no post is provided
    return null; // or <div>Loading...</div>
  }
  const time = post.published_at ? new Date(post.published_at).toLocaleTimeString() : 'Sometime';
  console.log(post);

  return (
    <Box display="flex" flexDirection={type === 'main' ? 'row' : 'column'} gap={4} width="100%">
      {post.feature_image && (
        <Box position="relative" minWidth="60%" height={type === 'main' ? '400px' : '300px'} overflow="hidden">
          <Image
            src={post.feature_image}
            alt={post.feature_image_alt || 'image'}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </Box>
      )}
      <Box display="flex" flexDirection="column" justifyContent="space-between" minHeight="200px">
        <Box>
          <div>{post.published_at ? dayjs(post.published_at).format('MMMM DD, YYYY') : 'Some Date'}</div>
          <Link to={`/${post.slug}`}>
            <Text fontSize="4xl" fontWeight="bolder" textColor="primary" sx={{ _hover: { color: 'secondary' } }}>
              {post.title}
            </Text>
          </Link>
          <Text mt={2} textColor="text2">
            {post.excerpt}...
          </Text>
        </Box>
        <Box display="flex" gap={2}>
          {post?.tags?.[0] &&
            post.tags.map((tag) => (
              <Box border="2px" borderColor="primary" px={2} borderLeftRadius="full" borderRightRadius="full">
                {tag.name}
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
}
