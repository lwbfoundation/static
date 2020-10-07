import React, { FunctionComponent } from 'react';
import { Heading, Button, Link, Box } from '@chakra-ui/core';
import { ButtonProps } from '@chakra-ui/core/dist/Button';
import { LinkProps } from '@chakra-ui/core/dist/Link';
import PostBody from '../post-body';
import HeadContent from '../head-content';
import Donate from '../donate/donate';
import EmailSignup from '../email-signup';
import { PageTemplateProps } from '../../templates/single/Page';

type ButtonLinkProps = ButtonProps & LinkProps;

const Homepage: FunctionComponent<PageTemplateProps> = ({ data }) => (
  <>
    <HeadContent title={data.wp.generalSettings.title} />
    <Heading
      as="h1"
      fontWeight={200}
      textTransform="uppercase"
      letterSpacing={4}
      fontFamily="Trade Gothic, Helvetica"
    >
      {data.wp.generalSettings.title}
    </Heading>
    <PostBody body={data.page.customHomepageOptions.subheading} />
    <PostBody body={data.page.content} />
    <Box maxWidth={600}>
      <Donate
        donateButtonText={data.page.customHomepageOptions.donatebuttontext}
      />
    </Box>
    <Box maxWidth={600}>
      <EmailSignup />
    </Box>
    <PostBody body={data.page.customHomepageOptions.legalinfo} />
  </>
);

export default Homepage;
