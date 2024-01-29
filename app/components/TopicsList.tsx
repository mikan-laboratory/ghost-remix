//External Library Imports
import { Text, Link } from '@chakra-ui/react';
import { Tag } from '@tryghost/content-api';

interface TopicsListProps {
  topics: Tag[];
}

export default function TopicsList({ topics }: TopicsListProps) {
  let topicsList;

  if (topics.length > 0) {
    topicsList = topics.map((topic, index) => (
      <span key={topic.id}>
        <Link href={`/search?query=${topic.name}`} color="primary">
          {topic.name?.toLowerCase()}
        </Link>
        {index < topics.length - 1 ? ' | ' : ''}
      </span>
    ));
  } else {
    topicsList = 'No topics';
  }

  return <Text textColor="text1">topics: {topicsList}</Text>;
}
