import React from 'react';
import { Link } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import CenteredLayout from '../components/centered-layout';

export default () => (
  <CenteredLayout>
    <Helmet>
      <title>Page not found • Lewis W. Butler Foundation</title>
    </Helmet>
    page not found.{' '}
    <Link href="/" textDecoration="underline">
      go to homepage
    </Link>
  </CenteredLayout>
);
