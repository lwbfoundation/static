import React, { FunctionComponent } from 'react';
import { graphql, StaticQuery } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';
import { Heading, Box, Text } from '@chakra-ui/core';
import styled from '@emotion/styled';
import striptags from 'striptags';
import PostBody from '../post-body';
import HeadContent from '../head-content';
import { PageTemplateProps } from '../../templates/single/Page';
import HomepageOpengraph from '../homepage-opengraph';
import AspectRatioResponsive from '../aspect-ratio-responsive';
import FormsContainer from '../forms-container';
import Team from '../team';

const BackgroundImage100 = styled(BackgroundImage)`
  width: 100%;
  height: 100%;
`;

const HeaderBackgroundImage: FunctionComponent = ({ children }) => (
  <StaticQuery
    query={graphql`
      query {
        mobile: file(
          relativePath: { eq: "javier-trueba-iQPr1XkF5F0-unsplash.jpg" }
        ) {
          childImageSharp {
            fluid(quality: 90, maxWidth: 480) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        desktop: file(
          relativePath: { eq: "javier-trueba-iQPr1XkF5F0-unsplash.jpg" }
        ) {
          childImageSharp {
            fluid(quality: 90, maxWidth: 1920) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    `}
    render={(data) => {
      const sources = [
        data.mobile.childImageSharp.fluid,
        {
          ...data.desktop.childImageSharp.fluid,
          media: '(min-width: 480px)',
        },
      ];
      return (
        <BackgroundImage100 fluid={sources}>{children}</BackgroundImage100>
      );
    }}
  />
);

const Homepage: FunctionComponent<PageTemplateProps> = ({ data }) => (
  <>
    <HeadContent title={data.wpCommonSiteSettings.title} />
    <HomepageOpengraph
      title={data.wpCommonSiteSettings.title}
      description={striptags(
        data.wpCommonSiteSettings.customCommonDataFields.subheading
      )}
    />
    <AspectRatioResponsive width="100%" ratio={[1, 1.85 / 1, null, 2.5 / 1]}>
      <Box
        backgroundColor="gray.type"
        backgroundSize="cover"
        overflow="visible"
      >
        <HeaderBackgroundImage>
          <AspectRatioResponsive
            width="100%"
            ratio={[1, 1.85 / 1, null, 2.5 / 1]}
          >
            <Box
              backgroundColor="blackAlpha.700"
              borderColor="blue.brand"
              borderBottomWidth={8}
            >
              <Text as="div" textAlign="center" color="white" paddingX="1rem">
                <Heading
                  as="h1"
                  fontWeight={200}
                  textTransform="uppercase"
                  letterSpacing={4}
                  fontFamily="Trade Gothic, Helvetica"
                >
                  {data.wpCommonSiteSettings.title}
                </Heading>
                <PostBody
                  body={
                    data.wpCommonSiteSettings.customCommonDataFields.subheading
                  }
                />
              </Text>
            </Box>
          </AspectRatioResponsive>
        </HeaderBackgroundImage>
      </Box>
    </AspectRatioResponsive>
    <FormsContainer
      donateButtonText={
        data.wpCommonSiteSettings.customCommonDataFields.donatebuttontext
      }
      emailSignupButtonText={
        data.wpCommonSiteSettings.customCommonDataFields
          .newslettersignupbuttontext
      }
      legalInfo={data.wpCommonSiteSettings.customCommonDataFields.legalinfo}
    />
    <Box marginX={[2, 4]}>
      <Box maxWidth={800} marginX="auto" marginBottom={16}>
        <Text as="div" fontSize="1.4em" textAlign="justify" marginBottom={16}>
          <PostBody body={data.page.content} />
        </Text>
      </Box>
      <Box maxWidth={1024} marginX="auto" marginBottom={16}>
        <Team />
      </Box>
    </Box>
    <Box
      width="100%"
      backgroundColor="gray.type"
      paddingX={[2, 4]}
      paddingY={6}
      borderColor="blue.brand"
      borderTopWidth={8}
    >
      <Text as="div" color="white" fontSize="sm" textAlign={['left', 'center']}>
        <PostBody
          body={data.wpCommonSiteSettings.customCommonDataFields.legalinfo}
        />
      </Text>
    </Box>
  </>
);

export default Homepage;
