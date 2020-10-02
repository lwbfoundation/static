import React, { FunctionComponent } from 'react';
import { Heading } from '@chakra-ui/core';
import PostBody from '../post-body';
import CenteredLayout from '../centered-layout';
import { PageTemplateProps } from '../../templates/single/Page';

const Placeholder: FunctionComponent<PageTemplateProps> = ({ data }) => (
  <CenteredLayout title={data.wp.generalSettings.title}>
    <Heading
      as="h1"
      fontWeight={200}
      textAlign="center"
      textTransform="uppercase"
      letterSpacing={4}
      fontFamily="Trade Gothic, Helvetica"
    >
      {data.wp.generalSettings.title}
    </Heading>
    <PostBody body={data.page.content} />
  </CenteredLayout>
);

export default Placeholder;
