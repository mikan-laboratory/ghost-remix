//external library imports
import dayjs from 'dayjs';

//internal module import
import { Box, Flex, Circle, Text, Image, Heading } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import { Post } from '~/types/blogTypes';
import colors from '~/theme/colors';

interface BlogListItemProps {
  post: Post;
}

export default function BlogListItem({ post }: BlogListItemProps) {
  let time = post.published_at ? new Date(post.published_at).toLocaleTimeString() : 0;
  return (
    <Box key={post.id} borderLeft={`2px solid ${colors.secondary}`} overflow="hidden" p={0} pb={10} w="full">
      <Flex alignItems="center">
        <Circle size="20px" bg={colors.secondary} position="absolute" left="11px" />

        <Text fontSize="4xl" fontWeight="bolder" ml={4} textColor={colors.primary}>
          {post.published_at ? `${dayjs(post.published_at).format('dddd')}` : 'Someday'}
        </Text>
      </Flex>
      <Text borderBottom={`2px solid ${colors.secondary}`} width="50%" pl={5} pb={1} textColor={colors.text2}>
        {dayjs(post.published_at).format('MM-DD-YY')} - {time} - {post.authors?.[0]?.name ?? 'Anonymous'}
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
        <Heading
          size="md"
          mt={2}
          ml={5}
          fontStyle="italic"
          textColor={colors.text1}
          sx={{ _hover: { color: colors.primary } }}
        >
          {post.title}
        </Heading>
      </Link>
      <Text mt={2} ml={5} textColor={colors.text2} width="80%">
        {post.excerpt}...
      </Text>
    </Box>
  );
}
