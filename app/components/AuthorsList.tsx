import { Text } from '@chakra-ui/react';
import { Author } from '~/types/blogTypes';

interface AuthorsListProps {
  authors: Author[];
}

export default function AuthorsList({ authors }: AuthorsListProps) {
  let authorNames = '';

  if (authors.length > 1) {
    // Join all but the last author with a comma
    const allButLast = authors
      .slice(0, -1)
      .map((author) => author.name)
      .join(', ');
    // Add the last author with an "&"
    const lastAuthor = authors[authors.length - 1].name;
    authorNames = `${allButLast} & ${lastAuthor}`;
  } else if (authors.length === 1) {
    // Only one author, so use their name directly
    authorNames = authors[0].name;
  }

  return <Text textColor="text1">written by: {authorNames}</Text>;
}
