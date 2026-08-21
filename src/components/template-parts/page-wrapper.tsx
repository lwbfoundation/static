import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, Flex, Link } from '@chakra-ui/react';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { PageTemplateProps } from '../../templates/single/Page';
import HeadContent from '../head-content';
import MainMenu from '../main-menu';
import { PageContainer } from '../styleguide/page-container';
import Logo from '../../assets/svg/logo.inline.svg';

type PageWrapperProps = PageTemplateProps & {
  invertMenuIconColor?: boolean;
  homepageVariant?: boolean;
  showHomeLink?: boolean;
  /** Prefixed to the site title. Omit on pages that are the site itself. */
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

  return (
    <>
      <HeadContent
        title={
          title
            ? `${title} | ${data.wpCommonSiteSettings.title}`
            : data.wpCommonSiteSettings.title
        }
      />
      {/* Full-viewport minimum height so a short page's footer, which sticks
          to the bottom of this box, still lands at the bottom of the window. */}
      <Box minHeight="100vh">
        {/* Mobile menu */}
        <Box
          display={[isMenuOpen ? 'flex' : 'none', null, 'none']}
          backgroundColor="blue.brand"
          color="white"
        >
          <MainMenu
            variant="mobile"
            showHomeLink={showHomeLink ?? !homepageVariant}
          />
        </Box>
        <PageContainer
          marginTop={[homepageVariant ? 0 : 2, null, 8]}
          paddingX={[2, null, 4]}
          backgroundColor="transparent"
        >
          <Flex alignItems="center">
            <Box
              display={[
                homepageVariant || isMenuOpen ? 'none' : 'block',
                null,
                'block',
              ]}
            >
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
                  fontSize={isMenuOpen ? 'xs' : 'xl'}
                  display={['inline-block', null, 'none']}
                  // whew
                  marginY={(() => {
                    if (homepageVariant && isMenuOpen) {
                      return 2;
                    }
                    if (isMenuOpen) {
                      return 3;
                    }
                    if (homepageVariant) {
                      return 1;
                    }

                    return 0;
                  })()}
                  position="absolute"
                  top={0}
                  right={isMenuOpen ? 3 : 2}
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
