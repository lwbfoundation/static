import { extendTheme } from '@chakra-ui/react';

const theme = {
  fonts: {
    heading: 'Edmond Sans',
    body: 'Edmond Sans',
  },
  components: {
    Heading: {
      baseStyle: {
        textDecoration: 'underline',
        textDecorationSkipInk: 'all',
        textUnderlineOffset: '0.5rem',
        fontWeight: 400,
      },
      variants: {
        h3: {
          textDecoration: 'none',
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 0,
        textTransform: 'uppercase',
      },
    },
  },
  colors: {
    gray: {
      icon: '#8A9799',
      type: '#474747',
    },
    blue: {
      brand: '#185B78',
    },
    mint: {
      brandlight: '#c5dccc',
      brand: '#B7D4C0',
      branddark: '#85b694',
    },
    green: {
      brand: '#54622B',
    },
    orange: {
      brand: '#F26742',
    },
    tan: {
      brandlight: '#E0CEC4',
      brand: '#D9C2B6',
      branddark: '#c3a08c',
    },
  },
};

export default extendTheme(theme);
