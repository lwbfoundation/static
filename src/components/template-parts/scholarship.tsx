import { Box, Divider, Text } from '@chakra-ui/react';
import React, { FunctionComponent } from 'react';
import { PageTemplateProps } from '../../templates/single/Page';
import PostBody from '../post-body';
import { PageContainer } from '../styleguide/page-container';
import PageWrapper from './page-wrapper';
import LogoHorizontal from '../../assets/svg/logo-horizontal.inline.svg';
import { SubmitButton } from '../form';
import HomepageOpengraph from '../homepage-opengraph';
import CustomHeading from '../custom-heading';

const ScholarshipPage: FunctionComponent<PageTemplateProps> = ({ data }) => {
  return (
    <PageWrapper data={data}>
      <HomepageOpengraph
        title={data.page.title}
        description="Now accepting applications for students in architecture, design, and related fields."
      />
      <PageContainer maxWidth={600}>
        <CustomHeading
          as="h1"
          marginY={16}
          textAlign="center"
          body={data.page.title}
        />
      </PageContainer>
      <PageContainer>
        <Divider
          borderColor="mint.brand"
          marginBottom={16}
          display={['none', null, 'block']}
        />
      </PageContainer>
      <PageContainer maxWidth={600}>
        <Text fontSize="xl">
          <PostBody marginBottom={8} fontSize="l" body={data.page.content} />

          <Text textAlign="center">
            <SubmitButton
              as="a"
              href="/application-form"
              target="_blank"
              marginTop={4}
              fontSize="xl"
              display="inline-block"
              paddingTop="0.7em"
              height={12}
            >
              View application form
            </SubmitButton>
            <Box marginTop={16} marginBottom={16}>
              <LogoHorizontal />
            </Box>
          </Text>
        </Text>
      </PageContainer>
    </PageWrapper>
  );
};

export default ScholarshipPage;
