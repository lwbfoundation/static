import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Box, Flex, AspectRatio, Link } from '@chakra-ui/react';
import striptags from 'striptags';
import PostBody from '../post-body';
import { wrapLeadSentence } from '../../utils/lead-sentence';
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
import Results from '../results';
import AnnouncementBanner from '../announcement-banner';
import ScholarArtwork from '../scholar-artwork';
import ScholarBanner from '../scholar-banner';
import PeopleCarousel from '../people-carousel';
import NewsletterSection from '../newsletter-section';

/** The wordmark's own proportions, and its height below `sm`. */
const LOGO_RATIO = 1.85;
const LOGO_HEIGHT = 120;

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
            aspectRatio: 1.333
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
            aspectRatio: 1.333
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
  const { applicationsOpen } = data.wpCommonSiteSettings.customCommonDataFields;
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, [setIsClient]);
  const [initialFormState, setInitialFormState] = useState(FormsState.none);
  const setStateFromHash = useCallback(() => {
    if (window.location.hash === '#donate') {
      setInitialFormState(FormsState.donate);
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
          {/* The buttons finish the column, level with the foot of the
              photograph, and the heading centres in what is left above them.
              They hold that arrangement by auto margin rather than by being
              taken out of the flow: at 768 this column is only about 290px
              wide, where the heading runs to five lines and the buttons wrap
              to two rows, and buttons laid over the column ran into the last
              line of the heading. In flow they push each other apart instead. */}
          <Flex
            width={['100%', null, '40%']}
            position="relative"
            direction="column"
          >
            <Box marginTop={[8, null, 12, 16]}>
              <CustomHeading
                body={
                  data.wpCommonSiteSettings.customCommonDataFields.subheading
                }
              />
            </Box>
            <Box paddingTop={4}>
              <HeaderButton as={Link} href="/#donate">
                Donate
              </HeaderButton>
              {applicationsOpen ? (
                <HeaderButton as={Link} href="/scholarship">
                  Apply
                </HeaderButton>
              ) : (
                <HeaderButton as={Link} href="/#sign-up">
                  Stay updated
                </HeaderButton>
              )}
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
          {/* The logo sits over the foot of the band at a fixed 120px, so the
              shorter the band the further up the photograph it reaches: the
              16/9 this used to run at is only about 210px tall on a phone,
              where the logo covered the right-hand student's jaw. The band
              holds the 4/3 the desktop header photograph uses instead, so
              both headers are cropped alike and the phone gets the height it
              needs. */}
          <AspectRatio ratio={4 / 3}>
            <div>
              {/* The wordmark is an inline SVG, so it takes plain height and
                  width attributes and cannot be sized per breakpoint itself.
                  The box it sits in is sized instead and the SVG fills it,
                  the same arrangement the top bar's logo uses. */}
              <Box
                position="absolute"
                bottom={0}
                right={0}
                height={[`${LOGO_HEIGHT}px`, `${LOGO_HEIGHT * 1.5}px`]}
                width={[
                  `${LOGO_HEIGHT * LOGO_RATIO}px`,
                  `${LOGO_HEIGHT * 1.5 * LOGO_RATIO}px`,
                ]}
              >
                <Logo
                  alt={data.wpCommonSiteSettings.title}
                  height="100%"
                  width="100%"
                  shapeRendering="geometricPrecision"
                />
              </Box>
            </div>
          </AspectRatio>
        </HeaderBackgroundImage>
      </Box>
      <PageContainer display={['block', 'block', 'none']} marginTop={10}>
        <CustomHeading
          body={data.wpCommonSiteSettings.customCommonDataFields.subheading}
          marginBottom={4}
          fontSize={['4xl', '5xl']}
        />
        <HeaderButton as={Link} href="/#donate">
          Donate
        </HeaderButton>
        {applicationsOpen ? (
          <HeaderButton as={Link} href="/scholarship">
            Apply
          </HeaderButton>
        ) : (
          <HeaderButton as={Link} href="/#sign-up">
            Stay updated
          </HeaderButton>
        )}
      </PageContainer>
      <AnnouncementBanner />
      <div id="about" />
      <PageContainer>
        <PostBody
          body={wrapLeadSentence(data.page.content)}
          leadSentence
          /* Matches the Lewis bio's body, which is set at the same size. */
          fontSize="1.4em"
          maxWidth={820}
          marginX="auto"
          textAlign={['left', null, 'center']}
          marginTop={[4, 8, 16]}
        />
      </PageContainer>

      <div id="forms" />
      <div id="donate" />
      <FormsContainer initialState={initialFormState} />

      <Box marginTop={[8, 12, 20]} position="relative" zIndex={1}>
        <PageContainer>
          <Box paddingTop={[8, 12, 16]}>
            <div id="results" />
            <Results />
          </Box>
        </PageContainer>
      </Box>

      <ScholarArtwork />

      <Box
        paddingTop={[4, 8, 16]}
        paddingBottom={[8, null, 16]}
        backgroundColor="blue.brand"
        color="white"
      >
        <PageContainer>
          <div id="lewis-w-butler" />
          <LewisBio />
        </PageContainer>
      </Box>

      <PeopleCarousel />

      <NewsletterSection />

      <Box marginTop={16}>
        <PageContainer>
          <div id="board" />
          <Team />
        </PageContainer>
      </Box>

      <ScholarBanner />

      <Footer data={data} flush />
    </PageWrapper>
  );
};

export default Homepage;
