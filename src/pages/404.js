import React from 'react';
import { Link } from '@chakra-ui/core';
import PrelaunchLayout from '../components/prelaunch-layout';

export default () => (
  <PrelaunchLayout>
    page not found.{' '}
    <Link href="/" textDecoration="underline">
      go to homepage
    </Link>
  </PrelaunchLayout>
);
