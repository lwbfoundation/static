import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, Flex, Link } from '@chakra-ui/react';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { PageTemplateProps } from '../../templates/single/Page';
import HeadContent from '../head-content';
import MainMenu from '../main-menu';
import { PageContainer } from '../styleguide/page-container';
import Logo from '../../assets/svg/logo.inline.svg';

const MENU_TRANSITION = '0.25s';
/**
 * The gutter Chakra's Container applies by default, and so the gutter every
 * other block on the page sits against. The menu icon is positioned against the
 * viewport rather than the container, so it has to be told the same number.
 */
const GUTTER = 4;

type PageWrapperProps = PageTemplateProps & {
  invertMenuIconColor?: boolean;
  homepageVariant?: boolean;
  showHomeLink?: boolean;
  /**
   * Overrides the page's own title in the document title. Only needed by
   * templates that render something other than a single page, like a news year.
   */
  title?: string;
};

const PageWrapper: FunctionComponent<PropsWithChildren<PageWrapperProps>> = ({
  data,
  children,
  invertMenuIconColor = false,
  homepageVariant = false,
  showHomeLink,
  title,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const MenuIcon = isMenuOpen ? CloseIcon : HamburgerIcon;

  /**
   * Every template used to have to pass its own title, and most did not, so
   * whole branches of the site — the recipients, the thank-you pages — shipped
   * with nothing but the site name in the tab. Defaulting to the page's title
   * means a template only opts out, never in.
   *
   * The site name is a suffix rather than a breadcrumb. Pages here are named to
   * stand alone, so walking the ancestors would only repeat them: the 2026
   * recipients sit under "Scholarship Recipients", itself under "Apply to the
   * Lewis W. Butler Foundation Scholarship". For the same reason a title that
   * already names the foundation does not get it a second time.
   */
  const siteTitle = data.wpCommonSiteSettings.title;
  const pageTitle = title ?? data.page?.title;
  const documentTitle = (() => {
    if (homepageVariant || !pageTitle) return siteTitle;
    if (pageTitle.includes(siteTitle)) return pageTitle;
    return `${pageTitle} | ${siteTitle}`;
  })();

  return (
    <>
      <HeadContent title={documentTitle} />
      {/* Full-viewport minimum height so a short page's footer, which sticks
          to the bottom of this box, still lands at the bottom of the window. */}
      <Box minHeight="100vh">
        {/* Mobile menu. A grid row animating between `0fr` and `1fr` resolves
            to the menu's own height, which `height`/`max-height` cannot do
            without either hard-coding a number or measuring the content. */}
        <Box
          display={['grid', null, 'none']}
          gridTemplateRows={isMenuOpen ? '1fr' : '0fr'}
          transition={`grid-template-rows ${MENU_TRANSITION} ease-in-out`}
          backgroundColor="blue.brand"
          color="white"
          sx={{
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          }}
        >
          <Box
            // The row can only collapse if its content is allowed to be
            // clipped and to shrink past its intrinsic height.
            overflow="hidden"
            minHeight={0}
            // Keeps the collapsed menu out of the tab order and away from
            // screen readers, but not until it has finished closing.
            visibility={isMenuOpen ? 'visible' : 'hidden'}
            transition={`visibility 0s linear ${
              isMenuOpen ? '0s' : MENU_TRANSITION
            }`}
          >
            <MainMenu
              variant="mobile"
              showHomeLink={showHomeLink ?? !homepageVariant}
            />
          </Box>
        </Box>
        <PageContainer
          marginTop={[homepageVariant ? 0 : 2, null, 8]}
          backgroundColor="transparent"
        >
          <Flex alignItems="center">
            <Box display={[homepageVariant ? 'none' : 'block', null, 'block']}>
              <Link href="/" userSelect="none">
                <Box
                  height={[`${60}px`, null, `${84}px`]}
                  width={[`${60 * 1.85}px`, null, `${84 * 1.85}px`]}
                >
                  <Logo
                    alt={data.wpCommonSiteSettings.title}
                    height="100%"
                    width="100%"
                  />
                </Box>
              </Link>
            </Box>
            <Box width={['100%', null, 'auto']}>
              <Box
                textAlign="right"
                marginBottom={[isMenuOpen ? 0 : -12, null, 0]}
              >
                <MenuIcon
                  as="button"
                  color={
                    invertMenuIconColor || isMenuOpen ? 'white' : 'blue.brand'
                  }
                  fontSize={isMenuOpen ? '2xl' : '4xl'}
                  display={['inline-block', null, 'none']}
                  // whew
                  marginY={(() => {
                    if (homepageVariant && isMenuOpen) {
                      return 3;
                    }
                    if (isMenuOpen) {
                      return 5;
                    }
                    if (homepageVariant) {
                      return 1;
                    }

                    return 1;
                  })()}
                  position="absolute"
                  top={0}
                  // The close glyph is set smaller than the hamburger, so it
                  // needs a touch more inset to look equally flush.
                  right={isMenuOpen ? GUTTER + 1 : GUTTER}
                  zIndex={1}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                />
              </Box>
              {/* Desktop menu */}
              <Box display={['none', null, 'block']}>
                <MainMenu variant="desktop" />
              </Box>
            </Box>
          </Flex>
        </PageContainer>
        {children}
      </Box>
    </>
  );
};

export default PageWrapper;
