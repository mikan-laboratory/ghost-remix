//External Library Imports
import {
  Box,
  Button,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mb={4} borderColor="primary" w="100%">
      <CommentInner comment={comment} member={member} />
      <Button
        size="sm"
        leftIcon={<FaReply />}
        variant="ghost"
        ml={2}
        color={showReply ? 'secondary' : 'primary'}
        onClick={() => setShowReply(!showReply)}
      >
        Reply
      </Button>
      {showReply && <CommentBox member={member} parentId={comment.id} />}
      {comment.other_comments.length > 0 && (
        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  View Replies
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
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
