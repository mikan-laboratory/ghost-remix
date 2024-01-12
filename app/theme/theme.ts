import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Poppins", sans-serif',
  },
  colors: {
    background: '#000000', //black
    text1: '#ffffff', //white
    text2: '#d0d0d0', //gray
    primary: '#0bd3d3', //miami vice blue
    secondary: '#f890e7', //miami vice pink
  },
});

export default theme;
