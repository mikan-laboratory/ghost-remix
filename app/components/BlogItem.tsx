//External Library Imports
import dayjs from 'dayjs';
import { Box, Text, Image } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import { PostOrPage } from '@tryghost/content-api';

interface BlogListItemProps {
  post?: PostOrPage;
  type: string;
}

export default function BlogItem({ post, type }: BlogListItemProps) {
  if (!post) return null;

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'column', md: type === 'primary' ? 'row' : 'column' }}
      gap={4}
      width="100%"
    >
      {post.feature_image && (
        <Box
          position="relative"
          minWidth="65%"
          height={{ base: '220px', md: type === 'primary' ? '375px' : type === 'secondary' ? '300px' : '200px' }}
          overflow="hidden"
        >
          <Link to={`/${post.slug}`}>
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
          </Link>
        </Box>
      )}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        minHeight={{ base: 0, md: type === 'list' ? 0 : '220px' }}
      >
        <Box>
          <div>
            {post.published_at ? dayjs(post.published_at).format('MM-DD-YY') : 'Some Date'} |{' '}
            {post.authors?.[0]?.name ?? 'Someone'}
          </div>
          <Link to={`/${post.slug}`}>
            <Text
              fontSize={{ base: '3xl', md: type === 'primary' ? '4xl' : type === 'secondary' ? '3xl' : 'xl' }}
              fontWeight="bolder"
              textColor="primary"
              sx={{ _hover: { color: 'secondary' } }}
            >
              {post.title}
            </Text>
          </Link>
          {type !== 'list' && (
            <Text mt={1} textColor="text2">
              {post.excerpt}...
            </Text>
          )}
        </Box>
        <Box display="flex" gap={2} pt="2">
          {type !== 'list' &&
            post?.tags?.[0] &&
            post.tags.map((tag) => (
              <Box
                key={tag.id}
                border="2px"
                borderColor="primary"
                px={2}
                borderLeftRadius="full"
                borderRightRadius="full"
              >
                {tag.name}
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
}
