import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Poppins", sans-serif',
  },
  colors: {
    background: '#ffffff',
    text1: '#000000',
    text2: '#708090',
    primary: '#f9b15c',
    secondary: '#b4d3b2',
  },
});

export default theme;
