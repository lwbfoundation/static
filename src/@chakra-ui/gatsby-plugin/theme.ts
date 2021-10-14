import { extendTheme, theme as baseTheme } from '@chakra-ui/react';

const theme = {
  colors: {
    gray: {
      icon: '#8A9799',
      type: '#474747',
    },
    blue: {
      brand: baseTheme.colors.blue['300'],
    },
  },
};

export default extendTheme(theme);
