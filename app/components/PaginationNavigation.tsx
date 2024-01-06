import { Flex, Button } from '@chakra-ui/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationNavigation({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <Flex justify="center">
      {currentPage > 1 && <Button onClick={() => onPageChange(currentPage - 1)}>Previous</Button>}
      {currentPage < totalPages && <Button onClick={() => onPageChange(currentPage + 1)}>Next</Button>}
    </Flex>
  );
}
