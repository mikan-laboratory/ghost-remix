import { Text } from '@chakra-ui/react';
import { Author } from '@tryghost/content-api';

interface AuthorsListProps {
  authors: Author[];
}

type AuthorWithName = Author & { name: string };

const getAuthorNames = (authors: Author[]): string => {
  const validAuthors = authors.filter((author) => author.name) as AuthorWithName[];

  if (validAuthors.length > 1) {
    const allButLast = validAuthors
      .slice(0, -1)
      .map((author) => author.name)
      .join(', ');
    // Add the last author with an "&"
    const lastAuthor = validAuthors[validAuthors.length - 1].name;

    return `${allButLast} & ${lastAuthor}`;
  }

  if (validAuthors.length === 1) {
    return validAuthors[0].name;
  }

  return 'Anonymous';
};

export default function AuthorsList({ authors }: AuthorsListProps) {
  const authorNames = getAuthorNames(authors);

  return <Text>{`${authorNames}`}</Text>;
}
