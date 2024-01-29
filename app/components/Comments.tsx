import { Box, Flex, Avatar, Text, Button, Spacer } from '@chakra-ui/react';
import { FaThumbsUp, FaReply } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { BasicMember } from '~/types/member';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  member: BasicMember | null;
}

// async function handleLike(commentId: string, currentLikes: number) {
//   const updatedLikes = currentLikes + 1;
//   console.log('liked', commentId, 'count:', updatedLikes);
// }

export default function Comments({ validComments, member }: CommentsProps) {
  console.log(validComments[0]);
  return validComments.map((comment) => (
    <Box key={comment.id} p={4} borderWidth="1px" borderRadius="lg" mb={4} borderColor="primary">
      <Flex align="center">
        {/* <Avatar name="Member Name" src={comment.member.avatar_image} /> */}
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
      {/* need to figure out likes and replies. */}
      {/* <Flex mt={2} align="center">
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
      )} */}
    </Box>
  ));
}
