import { theme as baseTheme } from '@chakra-ui/core';

const theme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    gray: {
      ...baseTheme.colors.gray,
      icon: '#8A9799',
      type: '#474747',
    },
    blue: {
      ...baseTheme.colors.blue,
      brand: baseTheme.colors.blue['300'],
    },
  },
};

export default theme;
