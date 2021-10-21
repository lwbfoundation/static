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
  Stack,
  Link,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import striptags from 'striptags';
import styled from '@emotion/styled';
import PostBody from '../post-body';
import HeadContent from '../head-content';
import { PageTemplateProps } from '../../templates/single/Page';
import HomepageOpengraph from '../homepage-opengraph';
import AspectRatioResponsive from '../aspect-ratio-responsive';
import BackgroundImage100 from '../background-image-100';
import FormsContainer, { FormsState, HeaderButton } from '../forms-container';
import LewisBio from '../lewis-bio';
import Team from '../team';
import Logo from '../../assets/svg/logo.inline.svg';
import HorizontalLogo from '../../assets/svg/logo-horizontal.inline.svg';
import Instagram from '../../assets/svg/social/instagram.inline.svg';
import { PageContainer } from '../styleguide/page-container';
import { DonateForm } from '../donate-form';

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
          gatsbyImageData(
            quality: 70
            width: 480
            layout: CONSTRAINED
            aspectRatio: 1.7778
            transformOptions: { cropFocus: NORTH }
          )
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
  useEffect(() => {
    if (isClient && window.location.hash === '#donate') {
      setInitialFormState(FormsState.donate);
    }
  }, [isClient]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const MenuIcon = isMenuOpen ? CloseIcon : HamburgerIcon;

  return (
    <>
      <HeadContent title={data.wpCommonSiteSettings.title} />
      <HomepageOpengraph
        title={data.wpCommonSiteSettings.title}
        description={striptags(
          data.wpCommonSiteSettings.customCommonDataFields.subheading
        )}
      />
      <PageContainer
        marginTop={[0, null, 8]}
        backgroundColor={['blue.brand', null, 'transparent']}
      >
        <Flex alignItems="center">
          <Box display={['none', null, 'block']}>
            <Logo
              alt={data.wpCommonSiteSettings.title}
              height={84}
              width={84 * 1.85}
            />
          </Box>
          <Box
            width={['100%', null, 'auto']}
            backgroundColor={['blue.brand', null, 'transparent']}
            color={['white', null, 'black']}
          >
            <Box
              textAlign="right"
              marginBottom={[isMenuOpen ? 0 : -12, null, 0]}
            >
              <MenuIcon
                as="button"
                color="white"
                fontSize={isMenuOpen ? 'xs' : 'xl'}
                display={['inline-block', null, 'none']}
                marginY={2}
                position="absolute"
                top={isMenuOpen ? 1 : 0}
                right={isMenuOpen ? 3 : 2}
                zIndex={1}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </Box>
            <Stack
              direction={['column', null, 'row']}
              marginLeft={[0, null, 16]}
              marginY={[4, null, 0]}
              spacing={[4, null, 8]}
              textAlign={['center', null, 'left']}
              textTransform="uppercase"
              fontWeight={600}
              width={['100%', null, 'auto']}
              display={[isMenuOpen ? 'flex' : 'none', null, 'flex']}
            >
              <Box>
                <Link
                  href="#forms"
                  onClick={() => {
                    setInitialFormState(FormsState.donate);
                  }}
                >
                  Donate
                </Link>
              </Box>
              <Box>
                <Link
                  href="#forms"
                  onClick={() => {
                    setInitialFormState(FormsState.newsletterSignup);
                  }}
                >
                  Newsletter
                </Link>
              </Box>
              <Box>
                <Link href="#about">About</Link>
              </Box>
              <Box>
                <Link href="#board">Board</Link>
              </Box>
            </Stack>
          </Box>
        </Flex>
      </PageContainer>
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
                onClick={() => setInitialFormState(FormsState.donate)}
                isSelected={initialFormState === FormsState.donate}
                marginBottom={[2, null, null, 0]}
              >
                {
                  data.wpCommonSiteSettings.customCommonDataFields
                    .donatebuttontext
                }
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
