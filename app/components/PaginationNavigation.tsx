import { Flex, Button } from '@chakra-ui/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationNavigation({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <Flex justify="center" gap="10">
      {currentPage > 1 && (
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          w={32}
          bg="background"
          color="primary"
          border="solid"
          borderColor="primary"
          sx={{
            ':hover': {
              bg: 'primary',
              borderColor: 'primary',
              color: 'text1',
            },
          }}
        >
          Previous
        </Button>
      )}
      {currentPage < totalPages && (
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          w={32}
          background="background"
          textColor="secondary"
          border="solid"
          borderColor="secondary"
          sx={{
            ':hover': {
              bg: 'secondary',
              borderColor: 'secondary',
              color: 'text1',
            },
          }}
        >
          Next
        </Button>
      )}
    </Flex>
  );
}
