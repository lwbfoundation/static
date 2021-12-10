import React, {
  FunctionComponent,
  useState,
  useEffect,
  ReactElement,
  ComponentProps,
  useCallback,
} from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import {
  Heading,
  Box,
  Text,
  Container,
  Flex,
  AspectRatio,
  Link,
} from '@chakra-ui/react';
import striptags from 'striptags';
import styled from '@emotion/styled';
import PostBody from '../post-body';
import { PageTemplateProps } from '../../templates/single/Page';
import HomepageOpengraph from '../homepage-opengraph';
import BackgroundImage100 from '../background-image-100';
import FormsContainer, { FormsState, HeaderButton } from '../forms-container';
import LewisBio from '../lewis-bio';
import Team from '../team';
import Logo from '../../assets/svg/logo.inline.svg';
import Instagram from '../../assets/svg/social/instagram.inline.svg';
import { PageContainer } from '../styleguide/page-container';
import PageWrapper from './page-wrapper';

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

const SkipInk = styled.div`
  text-decoration-skip-ink: none;
`;

function CustomHeading(props: ComponentProps<typeof PostBody>): ReactElement {
  return (
    <SkipInk>
      <PostBody
        as={Heading}
        color="orange.brand"
        fontSize={['4xl', null, '4xl', '5xl', '6xl']}
        lineHeight={1.25}
        textDecoration={['none', null, 'underline']}
        {...props}
      />
    </SkipInk>
  );
}

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
    <PageWrapper data={data}>
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
              <HeaderButton
                as={Link}
                href="/#donate"
                marginBottom={[2, null, null, 0]}
              >
                {
                  data.wpCommonSiteSettings.customCommonDataFields
                    .donatebuttontext
                }
              </HeaderButton>
              <HeaderButton as={Link} href="/#sign-up">
                {
                  data.wpCommonSiteSettings.customCommonDataFields
                    .newslettersignupbuttontext
                }
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
        <HeaderButton
          onClick={() => setInitialFormState(FormsState.donate)}
          isSelected={initialFormState === FormsState.donate}
        >
          {data.wpCommonSiteSettings.customCommonDataFields.donatebuttontext}
        </HeaderButton>
        <HeaderButton
          onClick={() => setInitialFormState(FormsState.newsletterSignup)}
          isSelected={initialFormState === FormsState.newsletterSignup}
        >
          {
            data.wpCommonSiteSettings.customCommonDataFields
              .newslettersignupbuttontext
          }
        </HeaderButton>
      </PageContainer>
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
                <Link
                  href={`mailto:${data.wpCommonSiteSettings.customCommonDataFields.contactemail}`}
                  textDecoration="none"
                >
                  {
                    data.wpCommonSiteSettings.customCommonDataFields
                      .contactemail
                  }
                </Link>
              </Text>
            </Box>
            {/* <Box
              width={['100%', 'auto']}
              flexBasis={[null, 1]}
              flexGrow={1}
              marginLeft={[0, 8]}
            >
              SUBSCRIBE
            </Box> */}
            <Box
              width={['100%', 'auto']}
              flexBasis={[null, 1]}
              flexGrow={1}
              marginTop={4}
              marginLeft={[0, 8]}
              textAlign={['center', 'center', 'right']}
            >
              <Link
                href="https://www.instagram.com/lewiswbutlerfdn/"
                target="_blank"
                rel="nofollow noreferrer"
              >
                <Instagram
                  width="40"
                  height="40"
                  fill="white"
                  alt="Lewis W. Butler Foundation on Instagram"
                  style={{ display: 'inline' }}
                />
              </Link>
            </Box>
          </Flex>
          <Box maxWidth={680} marginX="auto">
            <PostBody
              fontSize="xs"
              textAlign="center"
              body={data.wpCommonSiteSettings.customCommonDataFields.legalinfo}
            />
          </Box>
        </Container>
      </Box>
    </PageWrapper>
  );
};

export default Homepage;
