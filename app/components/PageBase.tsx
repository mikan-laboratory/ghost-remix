import { Box } from '@chakra-ui/react';
import Footer from './Footer';
import Header from './Header';

export const PageBase = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <Box
      minHeight="100vh"
      width="100vw"
      backgroundColor="background"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box py={5} maxWidth="90em" width="100%" alignSelf="center" minHeight="90vh">
        <Header />
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
