import { Text } from '@chakra-ui/react';
import colors from '~/theme/colors';

interface TopicsListProps {
  topics: [any];
}

export default function TopicsList({ topics }: TopicsListProps) {
  let topicsList = '';

  if (topics.length > 1) {
    // Join all but the last author with a comma
    topicsList = topics.map((topic: any) => topic.name).join(' | ');
  } else if (topics.length === 1) {
    // Only one author, so use their name directly
    topicsList = topics[0].name;
  }

  return <Text textColor={colors.text1}>Topics: {topicsList.toLowerCase()}</Text>;
}
