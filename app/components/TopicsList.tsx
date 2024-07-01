import { Link, Box } from '@chakra-ui/react';
import { Tag } from '@tryghost/content-api';

interface TopicsListProps {
  topics: Tag[];
}

export default function TopicsList({ topics }: TopicsListProps) {
  let topicsList;

  if (topics.length > 0) {
    topicsList = topics.map((topic) => (
      <Box
        key={topic.id}
        border="2px"
        borderColor="primary"
        py="2px"
        px="12px"
        borderStartRadius="full"
        borderEndRadius="full"
        textAlign="center"
      >
        <Link href={`/search?query=${topic.name}`} color="primary">
          #{topic.name?.toLowerCase()}
        </Link>
      </Box>
    ));
  } else {
    topicsList = 'No topics';
  }

  return (
    <Box textColor="text1" display="flex" gap={2} pt={4}>
      {topicsList}
    </Box>
  );
}
