import React from 'react';
import { Link } from '@chakra-ui/core';
import CenteredLayout from '../components/centered-layout';

export default () => (
  <CenteredLayout>
    page not found.{' '}
    <Link href="/" textDecoration="underline">
      go to homepage
    </Link>
  </CenteredLayout>
);
