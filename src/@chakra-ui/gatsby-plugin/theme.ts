import { extendTheme } from '@chakra-ui/react';

const theme = {
  /**
   * Chakra's reset paints an opaque white `body`, which would cover the blue
   * canvas the root element sets for the overscroll bands (see `HEAD_STYLES`
   * in gatsby-ssr.js). The page's own white comes from the app root instead.
   */
  styles: {
    global: {
      body: {
        bg: 'transparent',
      },
      /**
       * Hash links used to land flush against the top of their target, which
       * reads as standing too close to it. Offsetting where the scroll stops
       * leaves the element itself — and so the layout — untouched, and it
       * covers the `scrollIntoView` calls the forms make as well.
       */
      '[id]': {
        scrollMarginTop: '100px',
      },
    },
  },
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
