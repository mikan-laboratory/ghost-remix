import { Box } from '@chakra-ui/react';
import Footer from './Footer';
import Header from './Header';
import { PropsWithChildren } from 'react';

interface PageBaseProps extends PropsWithChildren {
  hideSignup?: boolean;
}

export const PageBase = ({ children, hideSignup = false }: PageBaseProps): JSX.Element => {
  return (
    <Box minHeight="100vh" width="100%" backgroundColor="background" display="flex" flexDirection="column">
      <Box flex="1" py={5} maxWidth="90em" width="100%" alignSelf="center">
        <Header hideSignup={hideSignup} />
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
