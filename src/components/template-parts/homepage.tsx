import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import {
  Box,
  Container,
  Flex,
  AspectRatio,
  Link,
  Text,
} from '@chakra-ui/react';
import striptags from 'striptags';
import PostBody from '../post-body';
import { PageTemplateProps } from '../../templates/single/Page';
import HomepageOpengraph from '../homepage-opengraph';
import BackgroundImage100 from '../background-image-100';
import FormsContainer, { FormsState, HeaderButton } from '../forms-container';
import LewisBio from '../lewis-bio';
import Team from '../team';
import Logo from '../../assets/svg/logo.inline.svg';
import { PageContainer } from '../styleguide/page-container';
import PageWrapper from './page-wrapper';
import Footer from './footer';
import CustomHeading from '../custom-heading';

const HeaderBackgroundImage: FunctionComponent = ({ children }) => {
  const data = useStaticQuery(graphql`
    {
      mobile: file(
        relativePath: { eq: "jeswin-thomas-8nHQx4zi9Wk-unsplash.jpg" }
      ) {
        childImageSharp {
          gatsbyImageData(
            quality: 70
            width: 960
            layout: CONSTRAINED
            aspectRatio: 1.7778
            transformOptions: { cropFocus: NORTH }
          )
        }
      }
      tablet: file(
        relativePath: { eq: "jeswin-thomas-8nHQx4zi9Wk-unsplash.jpg" }
      ) {
        childImageSharp {
          gatsbyImageData(
            quality: 70
            width: 1536
            layout: CONSTRAINED
            aspectRatio: 1.7778
            transformOptions: { cropFocus: NORTH }
          )
        }
      }
      desktop: file(
        relativePath: { eq: "jeswin-thomas-8nHQx4zi9Wk-unsplash.jpg" }
      ) {
        childImageSharp {
          gatsbyImageData(
            quality: 70
            transformOptions: { cropFocus: NORTH }
            aspectRatio: 1.333
            layout: FULL_WIDTH
          )
        }
      }
    }
  `);
  const sources = [
    data.mobile.childImageSharp.gatsbyImageData,
    {
      ...data.tablet.childImageSharp.gatsbyImageData,
      media: '(min-width: 480px)',
    },
    {
      ...data.desktop.childImageSharp.gatsbyImageData,
      media: '(min-width: 768px)',
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
  const [initialFormState, setInitialFormState] = useState(FormsState.none);
  const setStateFromHash = useCallback(() => {
    if (window.location.hash === '#donate') {
      setInitialFormState(FormsState.donate);
    } else if (window.location.hash === '#sign-up') {
      setInitialFormState(FormsState.newsletterSignup);
    }
  }, [setInitialFormState]);

  useEffect(() => {
    if (!isClient) return undefined;
    setStateFromHash();

    window.addEventListener('hashchange', setStateFromHash);
    return () => {
      window.removeEventListener('hashchange', setStateFromHash);
    };
  }, [isClient]);

  return (
    <PageWrapper
      homepageVariant
      data={data}
      invertMenuIconColor
      showHomeLink={false}
    >
      <HomepageOpengraph
        title={data.wpCommonSiteSettings.title}
        description={striptags(
          data.wpCommonSiteSettings.customCommonDataFields.subheading
        )}
      />
      <PageContainer
        marginTop={[0, null, 8]}
        display={['none', 'none', 'block']}
      >
        <Flex flexDirection={['column', 'column', 'row']} alignItems="stretch">
          <Flex
            width={['100%', null, '40%']}
            position="relative"
            alignItems="center"
          >
            <CustomHeading
              body={data.wpCommonSiteSettings.customCommonDataFields.subheading}
            />
            <Box position="absolute" bottom={0}>
              <HeaderButton as={Link} href="/#donate">
                Donate
              </HeaderButton>
              <HeaderButton as={Link} href="/scholarship">
                Apply
              </HeaderButton>
            </Box>
          </Flex>
          <Box width={['100%', null, '60%']}>
            <HeaderBackgroundImage>
              <AspectRatio ratio={4 / 3}>
                <Box display={['none', 'block']}>
                  <div />
                </Box>
              </AspectRatio>
            </HeaderBackgroundImage>
          </Box>
        </Flex>
      </PageContainer>
      <Box display={['block', 'block', 'none']} width="100%">
        <HeaderBackgroundImage>
          <AspectRatio ratio={16 / 9}>
            <div>
              <Box position="absolute" bottom={0} right={0}>
                <Logo
                  alt={data.wpCommonSiteSettings.title}
                  height={120}
                  width={120 * 1.85}
                  shapeRendering="geometricPrecision"
                />
              </Box>
            </div>
          </AspectRatio>
        </HeaderBackgroundImage>
      </Box>
      <PageContainer display={['block', 'block', 'none']} marginTop={4}>
        <CustomHeading
          body={data.wpCommonSiteSettings.customCommonDataFields.subheading}
          marginBottom={4}
          fontSize="4xl"
        />
        <HeaderButton as={Link} href="/#donate">
          Donate
        </HeaderButton>
        <HeaderButton as={Link} href="/scholarship">
          Apply
        </HeaderButton>
      </PageContainer>
      <Box backgroundColor="orange.brand" marginY={8} padding={8}>
        <Text fontSize="2em" textAlign="center" color="white">
          2025 Scholarship recipients have been annnounced!
        </Text>
        <Text textAlign="center">
          <HeaderButton
            textAlign="center"
            as={Link}
            href="/scholarship/recipients/2025-recipients"
          >
            See the 2025 Recipients
          </HeaderButton>
        </Text>
      </Box>
      <Container maxWidth="container.lg">
        <PostBody
          body={data.page.content}
          fontSize="lg"
          textAlign={['left', null, 'center']}
          marginTop={[4, 8, 16]}
        />
      </Container>

      <div id="forms" />
      <div id="donate" />
      <div id="sign-up" />
      <FormsContainer initialState={initialFormState} />

      <Box
        marginTop={[4, 8, 16]}
        paddingTop={[4, 8, 16]}
        paddingBottom={[8, null, 16]}
        backgroundColor="blue.brand"
        color="white"
      >
        <PageContainer>
          <div id="about" />
          <LewisBio />
        </PageContainer>
      </Box>

      <Box marginTop={[4, 8, 16]}>
        <PageContainer>
          <div id="board" />
          <Team />
        </PageContainer>
      </Box>

      <Footer data={data} />
    </PageWrapper>
  );
};

export default Homepage;
