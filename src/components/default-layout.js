/* eslint-disable */
import React from 'react';
import { Box, Grid } from '@chakra-ui/react';
import Header from './header';
import MainMenu from './main-menu';

import '../assets/style.css';

const DefaultLayout = ({ children }) => (
  <div>
    <Grid style={{ margin: '0 auto' }} maxW="90%" w={900} alignSelf="center">
      <Box mb={10} mt={20}>
        <Header />
      </Box>
      <Box mb={10} maxW="100%">
        <MainMenu variant="desktop" marginLeft={0} showHomeLink />
      </Box>

      <Box mb={100}>{children}</Box>
    </Grid>
  </div>
);

export default DefaultLayout;
