import React, { FunctionComponent } from 'react';
import PostBody from '../post-body';
import CenteredLayout from '../centered-layout';
import { PageTemplateProps } from '../../templates/single/Page';
import CustomHeading from '../custom-heading';

const Placeholder: FunctionComponent<PageTemplateProps> = ({ data }) => (
  <CenteredLayout title={data.wpCommonSiteSettings.title}>
    <CustomHeading
      as="h1"
      fontWeight={200}
      textAlign="center"
      textTransform="uppercase"
      letterSpacing={4}
      fontFamily="Edmond Sans, Helvetica"
      body={data.wpCommonSiteSettings.title}
    />
    <PostBody body={data.page.content} />
  </CenteredLayout>
);

export default Placeholder;
