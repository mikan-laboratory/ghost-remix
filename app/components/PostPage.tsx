import { Heading, Flex, Box, Image, Button, useToast, useUpdateEffect, Spinner, Container } from '@chakra-ui/react';
import AuthorsList from './AuthorsList';
import CommentsList from './CommentsList';
import PostContent from './PostContent';
import TopicsList from './TopicsList';
import { useCallback, useMemo, useState } from 'react';
import {
  JsonifiedPostPageProps,
  SummarizePostFailureResponse,
  SummarizePostResponse,
  SummarizePostSuccessResponse,
} from './types';
import { PageBase } from './PageBase';
import { FaBolt, FaFileAlt } from 'react-icons/fa';
import { useFetcher } from '@remix-run/react';
import dayjs from 'dayjs';
import { parseFeatureImage } from '~/parseFeatureImage';

export const PostPage = ({ post, comments, commentSettings, showRapidRead }: JsonifiedPostPageProps): JSX.Element => {
  const authors = post.authors ?? [];
  const tags = post.tags ?? [];

  const fetcher = useFetcher<SummarizePostResponse>();
  const toast = useToast();

  const [rapidRead, setRapidRead] = useState(false);
  const [postContent, setPostContent] = useState(post.html);

  const handleSummarize = useCallback((): void => {
    if (rapidRead) {
      setRapidRead(false);
      setPostContent(post.html);
      return;
    }

    const summary = localStorage.getItem(post.id);

    if (!rapidRead && summary) {
      setRapidRead(true);
      setPostContent(summary);
      return;
    }

    const form = new FormData();

    form.set('postId', post.id);
    fetcher.formData = form;

    fetcher.submit(form, {
      method: 'POST',
      action: `/summarize`,
    });
  }, [rapidRead]);

  useUpdateEffect(() => {
    if ((fetcher.data as SummarizePostSuccessResponse)?.result) {
      localStorage.setItem(post.id, (fetcher.data as SummarizePostSuccessResponse).result);
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
      <Container maxW="container.lg" px={{ base: 5, md: 0 }}>
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
                alt={post.posts_meta?.feature_image_alt ?? undefined}
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
          <Flex flexDirection={'column'} alignContent={'flex-start'} gap={2}>
            <Flex flexDirection={'row'} gap={6} mt={{ base: 2, md: 5 }} color="text2" fontSize="sm">
              {post.published_at ? dayjs(post.published_at).format('MMMM DD, YYYY') : 'Some Date'}
              <AuthorsList authors={authors} />
            </Flex>
            <Heading
              fontSize={{ base: 40, md: 40, lg: 50 }}
              textAlign={{ base: 'center', md: 'left' }}
              textColor="primary"
            >
              {post.title}
            </Heading>
          </Flex>
          <Flex
            justifyContent={'right'}
            alignItems={{ base: 'left', md: 'center' }}
            flexDirection={{ base: 'column', md: 'row' }}
            gap={2}
          >
            {showRapidRead && (
              <Button
                leftIcon={rapidRead ? <FaFileAlt color="white" /> : <FaBolt color="white" />}
                backgroundColor={rapidRead ? 'secondary' : 'tertiary2'}
                color="white"
                sx={{
                  ':hover': {
                    bg: rapidRead ? 'primary2' : 'tertiary',
                  },
                }}
                onClick={handleSummarize}
              >
                {rapidRead ? 'FullRead' : 'RapidRead'}
              </Button>
            )}
          </Flex>
        </Box>
        <Box py={5} textColor="text1">
          {['submitting', 'loading'].includes(fetcher.state) ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
            </Box>
          ) : (
            <PostContent html={postContent as string} />
          )}
          {tags.length > 0 && <TopicsList topics={tags} />}
        </Box>
        {commentsOn && (
          <Box>
            <CommentsList comments={comments} />
          </Box>
        )}
      </Container>
    </PageBase>
  );
};
