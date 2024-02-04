//External Library Imports
import dayjs from 'dayjs';
import { Box, Flex, Circle, Text, Image, Heading } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import { PostOrPage } from '@tryghost/content-api';

interface BlogListItemProps {
  post: PostOrPage;
}

export default function BlogListItem({ post }: BlogListItemProps) {
  let time = post.published_at ? new Date(post.published_at).toLocaleTimeString() : 'Sometime';
  return (
    <Box key={post.id} borderLeft="2px solid" borderColor="secondary" overflow="hidden" p={0} pb={10} w="full">
      <Flex alignItems="center">
        <Circle size="20px" bg="secondary" position="absolute" left={['10px', '10px', '10px', '91px']} />

        <Text fontSize="4xl" fontWeight="bolder" ml={4} textColor="primary">
          {post.published_at ? `${dayjs(post.published_at).format('dddd')}` : 'Someday'}
        </Text>
      </Flex>
      <Text borderBottom="2px solid" borderColor="secondary" width="50%" pl={5} pb={1} textColor="text2">
        {post.published_at ? dayjs(post.published_at).format('MM-DD-YY') : 'Some Date'} - {time} -{' '}
        {post.authors?.[0]?.name ?? 'Someone'}
      </Text>
      <Link to={`/${post.slug}`}>
        {post.feature_image && (
          <Box
            position="relative"
            width="50%"
            height="0"
            paddingBottom="25%"
            overflow="hidden"
            mt={5}
            ml={5}
            borderRadius="xl"
          >
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
        <Heading size="md" mt={2} ml={5} fontStyle="italic" textColor="text1" sx={{ _hover: { color: 'primary' } }}>
          {post.title}
        </Heading>
      </Link>
      <Text mt={2} ml={5} textColor="text2" width="80%">
        {post.excerpt}...
      </Text>
    </Box>
  );
}
