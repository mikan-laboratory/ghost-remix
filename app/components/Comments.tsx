import { Box, Flex, Text, Avatar, Button, Spacer } from '@chakra-ui/react';
import { FaThumbsUp, FaReply } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  status: string;
  html: string;
  created_at: string;
  edited_at: string | null;
  member: any; //i need to fix this later
  replies: Comment[];
  liked: boolean;
  count: {
    replies: number;
    likes: number;
  }; // Replace with the correct type if known
}

interface CommentsProps {
  comments: Comment[];
}

export default function Comments({ comments }: CommentsProps) {
  const validComments = Array.isArray(comments) ? comments : [];
  return (
    <Box display="flex" flexDirection="column" borderTopWidth="1px" borderTopColor="secondary">
      <Text fontSize="4xl" py={5} w="100%" textAlign="center">
        Join the Discussion ({validComments.length})
      </Text>
      {validComments.map((comment) => (
        <Box key={comment.id} p={4} borderWidth="1px" borderRadius="lg" mb={4} borderColor="primary">
          <Flex align="center">
            <Box ml={3}>
              <Text fontWeight="bold">
                {comment.member?.name ? comment.member.name : 'Anonymous'}
                <Text as="span" fontWeight="normal" color="gray.500" ml={2}>
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </Text>
              </Text>
              <Box dangerouslySetInnerHTML={{ __html: comment.html }} mt={2}></Box>
            </Box>
          </Flex>
          <Flex mt={2} align="center">
            <Button size="sm" leftIcon={<FaThumbsUp />} variant="ghost" color="secondary">
              Like
              {/* Like {comment.liked && '• 1'} */}
            </Button>
            <Button size="sm" leftIcon={<FaReply />} variant="ghost" ml={2} color="text1">
              Reply
            </Button>
            <Spacer />
            <Text fontSize="sm" color="gray.500">
              {comment.count.likes || 0} likes
            </Text>
          </Flex>
          {comment.replies.length > 0 && (
            <Box mt={4} pl={8} borderLeftWidth="1px">
              <Comments comments={comment.replies} />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}
