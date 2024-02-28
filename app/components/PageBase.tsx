import { Box } from '@chakra-ui/react';
import Footer from './Footer';
import Header from './Header';

export const PageBase = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <Box minHeight="100vh" backgroundColor="background" display="flex" flexDirection="column" alignItems="center">
      <Box flex="1" py={5} px={{ base: 5, sm: 10 }} maxWidth="90em" width="100%" alignSelf="center">
        <Header />
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
