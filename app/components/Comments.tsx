//External Library Imports
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { Prisma } from '@prisma/client';
//Internal Module Imports
import { BasicMember } from '~/types/member';

type CommentWithRelations = Prisma.commentsGetPayload<{
  include: {
    comment_likes: true;
    comment_reports: true;
    members: true;
    other_comments: true;
  };
}>;

interface CommentsProps {
  validComments: CommentWithRelations[];
  onDeleteComment: (commentId: string) => void;
  member: BasicMember | null;
}

export default function Comments({ validComments, onDeleteComment, member }: CommentsProps) {
  const handleDeleteComment = (commentId: string) => {
    onDeleteComment(commentId);
  };
  return validComments.map((comment) => (
    <Box key={comment.id} p={4} borderWidth="1px" borderRadius="lg" mb={4} borderColor="primary" w="100%">
      <Flex justifyContent="space-between" w="100%">
        <Flex align="center">
          <Box ml={3}>
            <Text fontWeight="bold">
              {comment.members?.name ? comment.members.name : 'Anonymous'}
              <Text as="span" fontWeight="normal" color="gray.500" ml={2}>
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </Text>
            </Text>
            <Box dangerouslySetInnerHTML={{ __html: comment.html || '<></>' }} mt={2}></Box>
          </Box>
        </Flex>
        {comment.member_id === member?.id && (
          <Button colorScheme="red" onClick={() => handleDeleteComment(comment.id)}>
            Delete
          </Button>
        )}
      </Flex>
      {/* need to figure out likes and replies logic. UI below would go here */}
    </Box>
  ));
}

/* 
this is the UI for likes and replies for later integration:
<Flex mt={2} align="center">
        <Button
          size="sm"
          leftIcon={<FaThumbsUp />}
          variant="ghost"
          color="text1"
          onClick={() => handleLike(comment.id, 1)}
          isDisabled={!member}
        >
          Like
        </Button>
        <Button size="sm" leftIcon={<FaReply />} variant="ghost" ml={2} color="text1">
          Reply
        </Button>
        <Spacer />
        <Text fontSize="sm" color="gray.500">
          {comment.comment_likes.length || 0} likes
        </Text>
      </Flex>
      {comment.other_comments.length > 0 && (
        <Box mt={4} pl={8} borderLeftWidth="1px">
          need to figure out replies
          <Comments validComments={comment.other_comments} member={member} />
        </Box>
      )} 
      */
