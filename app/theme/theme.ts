import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Poppins", sans-serif',
  },
  colors: {
    background: '#FFFBEC',
    background2: '#f9f9f9',
    comment: '#4A8BA02B',
    text1: '#000000',
    text2: '#708090',
    text3: '#FFFFFF',
    primary: '#0080a8',
    secondary: '#5a9b9d',
    tertiary: '#cb4900',
    tertiary2: '#faaf5b',
    primary2: '#01516a',
    pic: 'rgb(0,134,176)',
    pic2: 'rgb(227,150,0)',
  },
  styles: {
    global: {
      h1: {
        fontSize: '2.5em',
        marginBottom: '0.5em',
        fontWeight: 'bold',
        textAlign: 'left',
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2em',
        marginBottom: '0.4em',
        fontWeight: 'bold',
        textAlign: 'left',
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75em',
        marginBottom: '0.3em',
        fontWeight: 'bold',
        textAlign: 'left',
        lineHeight: 1.4,
      },
      a: {
        textDecoration: 'none',
        transition: 'color 0.3s',
        fontWeight: 'bold',
        color: 'primary',
        _hover: {
          color: 'tertiary2',
        },
      },
      blockquote: {
        margin: '1em 0',
        padding: '0.5em 1em',
        borderLeft: '4px solid',
        borderColor: 'primary',
        backgroundColor: 'background2',
        color: '#555',
        fontStyle: 'italic',
        lineHeight: 1.6,
      },
      hr: {
        borderColor: 'primary',
      },
      'blockquote p': {
        margin: 0,
      },
    },
  },
});

export default theme;
