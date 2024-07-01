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
          border="4px solid transparent"
          w={32}
          px="8px"
          borderRadius="md"
          textAlign="center"
          color="text3"
          backgroundColor="primary"
          padding={1}
          sx={{ _hover: { backgroundColor: 'secondary' } }}
        >
          Previous
        </Button>
      )}
      {currentPage < totalPages && (
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          border="4px solid transparent"
          w={32}
          px="8px"
          borderRadius="md"
          textAlign="center"
          color="text3"
          backgroundColor="primary"
          padding={1}
          sx={{ _hover: { backgroundColor: 'secondary' } }}
        >
          Next
        </Button>
      )}
    </Flex>
  );
}
