import React, {
  FunctionComponent,
  lazy,
  Suspense,
  useState,
  useEffect,
} from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Heading, Box, Text } from '@chakra-ui/react';
import striptags from 'striptags';
import PostBody from '../post-body';
import HeadContent from '../head-content';
import { PageTemplateProps } from '../../templates/single/Page';
import HomepageOpengraph from '../homepage-opengraph';
import AspectRatioResponsive from '../aspect-ratio-responsive';
import BackgroundImage100 from '../background-image-100';
import FormsContainer, { FormsState } from '../forms-container';
import LewisBio from '../lewis-bio';
import Team from '../team';

const LazyNewsletterSignup = lazy(
  () => import('../newsletter-signup/newsletter-signup')
);

const HeaderBackgroundImage: FunctionComponent = ({ children }) => {
  const data = useStaticQuery(graphql`
    {
      mobile: file(
        relativePath: { eq: "javier-trueba-iQPr1XkF5F0-unsplash.jpg" }
      ) {
        childImageSharp {
          gatsbyImageData(quality: 70, width: 480, layout: CONSTRAINED)
        }
      }
      desktop: file(
        relativePath: { eq: "javier-trueba-iQPr1XkF5F0-unsplash.jpg" }
      ) {
        childImageSharp {
          gatsbyImageData(
            quality: 70
            transformOptions: { cropFocus: NORTH }
            aspectRatio: 2.5
            layout: FULL_WIDTH
          )
        }
      }
    }
  `);
  const sources = [
    data.mobile.childImageSharp.gatsbyImageData,
    {
      ...data.desktop.childImageSharp.gatsbyImageData,
      media: '(min-width: 480px)',
    },
  ];
  return (
    <BackgroundImage100 image={sources as any}>{children}</BackgroundImage100>
  );
};

const Homepage: FunctionComponent<PageTemplateProps> = ({ data }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, [setIsClient]);

  return (
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
                    fontSize={['2em', '3em', '4em']}
                    fontFamily="Trade Gothic, Helvetica"
                  >
                    {data.wpCommonSiteSettings.title}
                  </Heading>
                  <Text as="div" fontSize={[null, null, '1.4em']}>
                    <PostBody
                      body={
                        data.wpCommonSiteSettings.customCommonDataFields
                          .subheading
                      }
                    />
                  </Text>
                </Text>
              </Box>
            </AspectRatioResponsive>
          </HeaderBackgroundImage>
        </Box>
      </AspectRatioResponsive>
      <FormsContainer
        initialState={
          isClient && window.location.hash === '#donate'
            ? FormsState.donate
            : FormsState.none
        }
      />
      <Box marginX={[2, 4]}>
        <Box maxWidth={800} marginX="auto" marginBottom={16}>
          <Text as="div" fontSize="1.4em" marginBottom={16}>
            <PostBody body={data.page.content} />
          </Text>
        </Box>
        <LewisBio />
        <Box maxWidth={1024} marginX="auto" marginBottom={8}>
          <Team />
        </Box>
        <Box maxWidth={520} marginX="auto" marginBottom={24}>
          {isClient && (
            <Suspense fallback={null}>
              <Heading
                textAlign="center"
                as="h2"
                fontWeight={200}
                textTransform="uppercase"
                letterSpacing={4}
                marginBottom={8}
                fontFamily="Trade Gothic, Helvetica"
              >
                {
                  data.wpCommonSiteSettings.customCommonDataFields
                    .newslettersignupbuttontext
                }
              </Heading>
              <LazyNewsletterSignup signupButtonText="Sign up" />
            </Suspense>
          )}
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
        <Text
          as="div"
          color="white"
          fontSize="sm"
          textAlign={['left', 'center']}
        >
          <PostBody
            body={data.wpCommonSiteSettings.customCommonDataFields.legalinfo}
          />
        </Text>
      </Box>
    </>
  );
};

export default Homepage;
