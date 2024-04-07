import { Heading, Flex, Box, Image, Button, useToast, useUpdateEffect, Spinner } from '@chakra-ui/react';
import AuthorsList from './AuthorsList';
import CommentsList from './CommentsList';
import PostContent from './PostContent';
import TopicsList from './TopicsList';
import { useCallback, useMemo, useState } from 'react';
import { GetPostOutput } from '~/content-api/types';
import {
  JsonifiedPostPageProps,
  SummarizePostFailureResponse,
  SummarizePostResponse,
  SummarizePostSuccessResponse,
} from './types';
import { PageBase } from './PageBase';
import { FaBolt, FaFileAlt } from 'react-icons/fa';
import { useFetcher } from '@remix-run/react';

export const PostPage = ({ post, comments, commentSettings }: JsonifiedPostPageProps): JSX.Element => {
  const authors = post.authors ?? [];
  const tags = post.tags ?? [];

  const parseFeatureImage = (featureImageURL: string): string => {
    if (featureImageURL.includes('__GHOST_URL__')) {
      return featureImageURL.replace('__GHOST_URL__', '');
    }

    return featureImageURL;
  };

  const fetcher = useFetcher<SummarizePostResponse>();
  const toast = useToast();

  const [rapidRead, setRapidRead] = useState(false);
  const [summary, setSummary] = useState<string | undefined>();
  const [postContent, setPostContent] = useState(post.html);

  const handleSummarize = useCallback((): void => {
    if (rapidRead) {
      setRapidRead(false);
      setPostContent(post.html);
      return;
    }

    if (!rapidRead && summary) {
      setRapidRead(true);
      setPostContent(summary);
      return;
    }

    fetcher.submit(
      {
        post: post.html as string,
      },
      {
        method: 'POST',
        action: '/summarizePost',
      },
    );
  }, [summary, rapidRead]);

  useUpdateEffect(() => {
    if ((fetcher.data as SummarizePostSuccessResponse)?.result) {
      setSummary((fetcher.data as SummarizePostSuccessResponse).result);
      setPostContent((fetcher.data as SummarizePostSuccessResponse).result);
      setRapidRead(true);
    }

    if ((fetcher.data as SummarizePostFailureResponse)?.error) {
      toast({
        title: 'Error',
        description: (fetcher.data as SummarizePostFailureResponse).error,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }, [fetcher.data]);

  const commentsOn = useMemo(() => {
    if (post.type === 'page') return false;
    if (commentSettings === 'off') return false;

    return true;
  }, [commentSettings, post.type]);

  return (
    <PageBase>
      <Box pb={5} px={5}>
        {post.feature_image && (
          <Box
            position="relative"
            width="100%"
            height="0"
            paddingBottom={{ base: '70%', md: '40%' }}
            overflow="hidden"
            mt={5}
            borderRadius="xl"
          >
            <Image
              src={parseFeatureImage(post.feature_image)}
              alt={(post as GetPostOutput).feature_image_alt ?? 'image'}
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
        <Flex justifyContent="space-between" mt={{ base: 2, md: 5 }}>
          <AuthorsList authors={authors} />
        </Flex>
        <Heading fontSize={{ base: 40, md: 40, lg: 50 }} textAlign={{ base: 'center', md: 'left' }} textColor="text1">
          {post.title}
        </Heading>
        <Flex
          justifyContent={tags.length > 0 ? 'space-between' : 'right'}
          alignItems={{ base: 'left', md: 'center' }}
          flexDirection={{ base: 'column', md: 'row' }}
          gap={2}
        >
          {tags.length > 0 && <TopicsList topics={tags} />}
          {post.type !== 'page' && (
            <Button
              leftIcon={rapidRead ? <FaFileAlt color="white" /> : <FaBolt color="white" />}
              backgroundColor={rapidRead ? 'primary' : 'secondary'}
              color="white"
              _hover={{ bg: `${rapidRead ? 'primary' : 'secondary'}` }}
              _active={{ bg: `${rapidRead ? 'primary' : 'secondary'}` }}
              onClick={handleSummarize}
            >
              {rapidRead ? 'FullRead' : 'RapidRead'}
            </Button>
          )}
        </Flex>
      </Box>
      <Box py={5} px={5} textColor="text1">
        {['submitting', 'loading'].includes(fetcher.state) ? (
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        ) : (
          <PostContent html={postContent as string} />
        )}
      </Box>
      {commentsOn && (
        <Box>
          <CommentsList comments={comments} />
        </Box>
      )}
    </PageBase>
  );
};
