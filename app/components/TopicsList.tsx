import { Text } from '@chakra-ui/react';
import colors from '~/theme/colors';
import { Tag } from '~/types/blogTypes';

interface TopicsListProps {
  topics: Tag[];
}

export default function TopicsList({ topics }: TopicsListProps) {
  let topicsList = '';

  if (topics.length > 1) {
    topicsList = topics.map((topic) => topic.name).join(' | ');
  } else if (topics.length === 1) {
    topicsList = topics[0].name;
  }

  return <Text textColor={colors.text1}>Topics: {topicsList.toLowerCase()}</Text>;
}
