import { Box, Heading, Text } from '@chakra-ui/react';
import React, { FunctionComponent } from 'react';
import { PageTemplateProps } from '../../templates/single/Page';
import PostBody from '../post-body';
import { PageContainer } from '../styleguide/page-container';
import PageWrapper from './page-wrapper';
import LogoHorizontal from '../../assets/svg/logo-horizontal.inline.svg';
import { SubmitButton } from '../form';

const RecommendPage: FunctionComponent<PageTemplateProps> = ({ data }) => {
  return (
    <PageWrapper data={data}>
      <PageContainer maxWidth={600}>
        <Heading marginY={16} as="h1" color="orange.brand" textAlign="center">
          {data.page.title}
        </Heading>
        <Text textAlign="center" fontSize="xl">
          <PostBody marginBottom={8} fontSize="l" body={data.page.content} />
          <SubmitButton
            as="a"
            href="https://docs.google.com/forms/d/e/1FAIpQLSehXwwgTHGTb99U3tmUx7Q-W8aauPuQEbjO7FVRdhTpkWpMUA/viewform"
            marginTop={4}
          >
            View recommender form
          </SubmitButton>
          <Box marginTop={16} marginBottom={16}>
            <LogoHorizontal />
          </Box>
        </Text>
      </PageContainer>
    </PageWrapper>
  );
};

export default RecommendPage;
