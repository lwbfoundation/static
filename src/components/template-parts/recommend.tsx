import { Divider, Text } from '@chakra-ui/react';
import React, { FunctionComponent } from 'react';
import { PageTemplateProps } from '../../templates/single/Page';
import PostBody from '../post-body';
import { PageContainer } from '../styleguide/page-container';
import PageWrapper from './page-wrapper';
import Footer from './footer';
import { SubmitButton } from '../form';
import CustomHeading from '../custom-heading';
import ApplicationsClosedLinks from '../applications-closed-links';

const RecommendPage: FunctionComponent<PageTemplateProps> = ({ data }) => {
  const { applicationsOpen } = data.wpCommonSiteSettings.customCommonDataFields;

  return (
    <PageWrapper data={data}>
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
            {applicationsOpen ? (
              <SubmitButton
                as="a"
                href="/recommender-form"
                target="_blank"
                marginTop={4}
                fontSize="xl"
                display="inline-block"
                paddingTop="0.7em"
                height={12}
              >
                View recommender form
              </SubmitButton>
            ) : (
              <ApplicationsClosedLinks />
            )}
          </Text>
        </Text>
      </PageContainer>
      <Footer data={data} />
    </PageWrapper>
  );
};

export default RecommendPage;
