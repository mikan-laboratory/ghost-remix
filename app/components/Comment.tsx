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
} from '@chakra-ui/react';
//Internal Module Imports
import { BasicMember } from '~/types/member';
import { CommentWithRelations } from './types';
import { useState } from 'react';
import { FaReply } from 'react-icons/fa';
import { CommentInner } from './CommentInner';
import CommentBox from './CommentBox';

interface CommentsProps {
  comment: CommentWithRelations;
  member: BasicMember | null;
}

export default function Comment({ comment, member }: CommentsProps): JSX.Element {
  const [showReply, setShowReply] = useState(false);
  const [accordionIndex, setAccordionIndex] = useState<number>(-1);

  const handleReply = (): void => {
    if (!showReply) setAccordionIndex(0);
    setShowReply(!showReply);
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mb={4} borderColor="primary" w="100%">
      <CommentInner comment={comment} member={member} />
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
