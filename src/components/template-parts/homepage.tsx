import React, {
  FunctionComponent,
  lazy,
  Suspense,
  useState,
  useEffect,
  PropsWithChildren,
  ReactElement,
  ComponentProps,
} from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import {
  Heading,
  Box,
  Text,
  Container,
  Flex,
  AspectRatio,
} from '@chakra-ui/react';
import striptags from 'striptags';
import styled from '@emotion/styled';
import PostBody from '../post-body';
import HeadContent from '../head-content';
import { PageTemplateProps } from '../../templates/single/Page';
import HomepageOpengraph from '../homepage-opengraph';
import AspectRatioResponsive from '../aspect-ratio-responsive';
import BackgroundImage100 from '../background-image-100';
import FormsContainer, { FormsState } from '../forms-container';
import LewisBio from '../lewis-bio';
import Team from '../team';
import Logo from '../../assets/svg/logo.inline.svg';
import HorizontalLogo from '../../assets/svg/logo-horizontal.inline.svg';
import { PageContainer } from '../styleguide/page-container';

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

const CustomHeadingStyle = styled.div`
  text-decoration-skip-ink: none;
  text-underline-offset: 0.6rem;
`;

function CustomHeading(props: ComponentProps<typeof PostBody>): ReactElement {
  return (
    <CustomHeadingStyle>
      <PostBody
        color="orange.brand"
        textDecoration="underline"
        fontSize="6xl"
        fontWeight={400}
        lineHeight={1.25}
        {...props}
      />
    </CustomHeadingStyle>
  );
}

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
      <PageContainer marginTop={[4, 8]}>
        <Box display={['none', 'block']}>
          <Logo
            alt={data.wpCommonSiteSettings.title}
            height={84}
            width={84 * 1.85}
            shapeRendering="geometricPrecision"
          />
        </Box>
        <Box display={['block', 'none']}>
          <HorizontalLogo alt={data.wpCommonSiteSettings.title} />
        </Box>
      </PageContainer>
      <PageContainer
        marginTop={['1rem', null, 8]}
        display={['none', 'none', 'block']}
      >
        <Flex flexDirection={['column', 'column', 'row']} alignItems="center">
          <Box width={['100%', null, '40%']}>
            <CustomHeading
              body={data.wpCommonSiteSettings.customCommonDataFields.subheading}
            />
          </Box>
          <Box width={['100%', null, '60%']}>
            <HeaderBackgroundImage>
              <AspectRatio ratio={4 / 3}>
                <div />
              </AspectRatio>
            </HeaderBackgroundImage>
          </Box>
        </Flex>
      </PageContainer>
      <Box display={['block', 'block', 'none']} width="100%" marginTop={4}>
        <HeaderBackgroundImage>
          <AspectRatio ratio={16 / 9}>
            <div />
          </AspectRatio>
        </HeaderBackgroundImage>
      </Box>
      <PageContainer display={['block', 'block', 'none']} marginTop={4}>
        <CustomHeading
          body={data.wpCommonSiteSettings.customCommonDataFields.subheading}
          fontSize="4xl"
        />
      </PageContainer>
      <Container maxWidth="container.lg">
        <PostBody
          body={data.page.content}
          fontSize="lg"
          textAlign="center"
          marginTop={[4, 8, 16]}
        />
      </Container>

      {/* <FormsContainer
        initialState={
          isClient && window.location.hash === '#donate'
            ? FormsState.donate
            : FormsState.none
        }
      /> */}

      {/* <LewisBio /> */}
      {/* <Team /> */}
      {/* {isClient && (
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
      )} */}

      <Box backgroundColor="orange.brand" color="white">
        <Container
          maxWidth="container.lg"
          marginTop={[4, 8, 16]}
          paddingTop={[4, 8, 16]}
          paddingBottom={4}
        >
          <Flex marginBottom={[4, 8, 16]} alignItems="center" flexWrap="wrap">
            <Box height={['60px', '100px']} width={[60 * 1.85, 100 * 1.85]}>
              <Logo
                alt={data.wpCommonSiteSettings.title}
                width="100%"
                shapeRendering="geometricPrecision"
              />
            </Box>
            <Box flexBasis={1} flexGrow={1} marginLeft={4}>
              <Text fontSize={['smaller', 'initial']}>
                <PostBody
                  body={
                    data.wpCommonSiteSettings.customCommonDataFields.address
                  }
                />
                {data.wpCommonSiteSettings.customCommonDataFields.contactemail}
              </Text>
            </Box>
            <Box
              width={['100%', 'auto']}
              flexBasis={[null, 1]}
              flexGrow={1}
              marginLeft={[0, 8]}
            >
              SUBSCRIBE
            </Box>
            <Box
              width={['100%', 'auto']}
              flexBasis={[null, 1]}
              flexGrow={1}
              marginLeft={[0, 8]}
            >
              Social
            </Box>
          </Flex>
          <PostBody
            fontSize="xs"
            textAlign="center"
            body={data.wpCommonSiteSettings.customCommonDataFields.legalinfo}
          />
        </Container>
      </Box>
    </>
  );
};

export default Homepage;
