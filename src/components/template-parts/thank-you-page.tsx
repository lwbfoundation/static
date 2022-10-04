import { Box, Heading, Text } from '@chakra-ui/react';
import React, { FunctionComponent } from 'react';
import { PageTemplateProps } from '../../templates/single/Page';
import PostBody from '../post-body';
import { PageContainer } from '../styleguide/page-container';
import PageWrapper from './page-wrapper';
import LogoHorizontal from '../../assets/svg/logo-horizontal.inline.svg';
import CustomHeading from '../custom-heading';

const ThankYouPage: FunctionComponent<PageTemplateProps> = ({ data }) => {
  return (
    <PageWrapper data={data}>
      <PageContainer maxWidth={600}>
        <CustomHeading
          as="h1"
          marginY={16}
          textAlign="center"
          body={data.page.wpParent?.node.title || ''}
        />
        <Text textAlign="center" fontSize="xl">
          <PostBody marginBottom={8} fontSize="l" body={data.page.content} />
          <PostBody
            fontSize="l"
            body={data.page.wpParent?.node.content || ''}
          />
          <Box marginTop={16} marginBottom={16}>
            <LogoHorizontal />
          </Box>
        </Text>
      </PageContainer>
    </PageWrapper>
  );
};

export default ThankYouPage;
