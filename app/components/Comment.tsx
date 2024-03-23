//External Library Imports
import {
  Box,
  Button,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Tooltip,
  Text,
} from '@chakra-ui/react';
import { useFetcher, useParams } from '@remix-run/react';
//Internal Module Imports
import { BasicMember } from '~/types/member';
import { JsonifiedPostPageProps } from './types';
import { useState, useCallback } from 'react';
import { FaReply, FaThumbsUp } from 'react-icons/fa';
import { CommentInner } from './CommentInner';
import CommentBox from './CommentBox';

interface CommentsProps {
  comment: Pick<JsonifiedPostPageProps, 'comments'>['comments'][number];
  member: BasicMember | null;
}

export default function Comment({ comment, member }: CommentsProps): JSX.Element {
  const commentId = comment.id;
  const memberLikedComment = Boolean(comment.comment_likes.find((like) => like.member_id === member?.id));

  const [isLiked, setIsLiked] = useState(memberLikedComment);
  const [showReply, setShowReply] = useState(false);
  const [accordionIndex, setAccordionIndex] = useState<number>(-1);

  const params = useParams();
  const postSlug = params.postSlug;
  const fetcher = useFetcher<{ error: string }>();

  const handleReply = (): void => {
    if (!showReply) setAccordionIndex(0);
    setShowReply(!showReply);
  };

  const handleLikeComment = useCallback(async () => {
    fetcher.submit(
      { commentId: commentId.toString() },
      {
        method: isLiked ? 'DELETE' : 'POST',
        action: `/${postSlug}/comments/${commentId}/likes`,
        preventScrollReset: true,
      },
    );

    setIsLiked(!isLiked);
  }, [isLiked, commentId, fetcher, postSlug]);

  return (
    <Box px={9} mb={4} w="100%">
      <CommentInner comment={comment} member={member} />
      <Box display="flex" alignItems="center">
        <Tooltip label={member ? '' : 'Log In to Like'} hasArrow>
          <Button
            size="sm"
            leftIcon={<FaThumbsUp />}
            variant="ghost"
            color={isLiked ? 'secondary' : 'primary'}
            onClick={handleLikeComment}
            isDisabled={!member}
          >
            {comment.comment_likes.length} likes
          </Button>
        </Tooltip>
        <Text color="secondary"> | </Text>
        <Tooltip label={member ? '' : 'Log In to Reply'} hasArrow>
          <Button
            size="sm"
            leftIcon={<FaReply />}
            variant="ghost"
            ml={2}
            color={showReply ? 'secondary' : 'primary'}
            onClick={handleReply}
            isDisabled={!member}
          >
            Reply
          </Button>
        </Tooltip>
      </Box>
      {showReply && <CommentBox member={member} parentId={comment.id} />}
      {comment.other_comments.length > 0 && (
        <Accordion
          allowToggle
          index={accordionIndex}
          onChange={(index) => setAccordionIndex(index as number)}
          borderColor="secondary"
        >
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" color="primary" sx={{ _hover: { color: 'secondary' } }}>
                  {comment.other_comments.length === 1
                    ? `View 1 Reply`
                    : `View ${comment.other_comments.length} Replies`}
                </Box>
                <AccordionIcon color="white" />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} pr={0}>
              {comment.other_comments.map((reply) => (
                <CommentInner key={reply.id} comment={reply} member={member} />
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
    </Box>
  );
}
