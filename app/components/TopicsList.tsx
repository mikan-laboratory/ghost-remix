//External Library Imports
import { Text, Link, Box } from '@chakra-ui/react';
import { Tag } from '@tryghost/content-api';

interface TopicsListProps {
  topics: Tag[];
}

export default function TopicsList({ topics }: TopicsListProps) {
  let topicsList;

  if (topics.length > 0) {
    topicsList = topics.map((topic, index) => (
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
        {index < topics.length - 1 ? ' | ' : ''}
      </Box>
    ));
  } else {
    topicsList = 'No topics';
  }

  return <Text textColor="text1">{topicsList}</Text>;
}
