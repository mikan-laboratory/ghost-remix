import { Heading, Flex, Box, Image } from '@chakra-ui/react';
import { PostOrPage } from '@tryghost/content-api';
import AuthorsList from './AuthorsList';
import CommentsList from './CommentsList';
import Header from './Header';
import PostContent from './PostContent';
import TopicsList from './TopicsList';
import { CommentWithRelations } from './types';

interface PostPageProps {
  post: PostOrPage;
  comments: CommentWithRelations[];
  commentSettings: string;
}

export const PostPage = ({ post, comments, commentSettings }: PostPageProps): JSX.Element => {
  const authors = post.authors ?? [];
  const tags = post.tags ?? [];

  const parseFeatureImage = (featureImageURL: string): string => {
    if (featureImageURL.includes('__GHOST_URL__')) {
      return featureImageURL.replace('__GHOST_URL__', '');
    }

    return featureImageURL;
  };

  return (
    <Box minHeight="100vh" backgroundColor="background" display="flex" justifyContent="center">
      <Box py="5%" px={{ base: 5, sm: 10 }} maxWidth="70em">
        <Header />
        <Box pb={5} borderBottom="2px solid" borderColor="secondary">
          <Heading fontSize={{ base: 30, sm: 40, md: 60 }} textAlign={{ base: 'center', md: 'left' }} textColor="text1">
            {post.title}
          </Heading>
          {post.feature_image && (
            <Box
              position="relative"
              width="100%"
              height="0"
              paddingBottom="40%"
              overflow="hidden"
              mt={5}
              borderRadius="xl"
            >
              <Image
                src={parseFeatureImage(post.feature_image)}
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
          <Flex justifyContent="space-between" mt={5}>
            <AuthorsList authors={authors} />
            {tags.length > 0 && <TopicsList topics={tags} />}
          </Flex>
        </Box>
        <Box py={5} textColor="text2">
          <PostContent html={post.html ?? ''} />
        </Box>
        {commentSettings !== 'off' && (
          <Box>
            <CommentsList comments={comments} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
