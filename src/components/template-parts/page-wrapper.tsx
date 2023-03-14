import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, Flex, Link, Stack } from '@chakra-ui/react';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { PageTemplateProps } from '../../templates/single/Page';
import HeadContent from '../head-content';
import { PageContainer } from '../styleguide/page-container';
import Logo from '../../assets/svg/logo.inline.svg';

type PageWrapperProps = PageTemplateProps & {
  invertMenuIconColor?: boolean;
  homepageVariant?: boolean;
};

const PageWrapper: FunctionComponent<PropsWithChildren<PageWrapperProps>> = ({
  data,
  children,
  invertMenuIconColor = false,
  homepageVariant = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const MenuIcon = isMenuOpen ? CloseIcon : HamburgerIcon;

  return (
    <>
      <HeadContent title={data.wpCommonSiteSettings.title} />
      {/* Mobile menu */}
      <Box
        display={[isMenuOpen ? 'flex' : 'none', null, 'none']}
        backgroundColor="blue.brand"
        color="white"
      >
        <Stack
          direction="column"
          // marginLeft={0}
          marginY={4}
          spacing={4}
          textAlign="center"
          textTransform="uppercase"
          textUnderlineOffset="0.25rem"
          fontWeight={600}
          width="100%"
        >
          {!homepageVariant && (
            <Box>
              <Link href="/">Home</Link>
            </Box>
          )}
          <Box>
            <Link href="/#donate">Donate</Link>
          </Box>
          <Box>
            <Link href="/scholarship">For Students</Link>
          </Box>
          <Box>
            <Link href="/#sign-up">Newsletter</Link>
          </Box>
          <Box>
            <Link href="/#about">About</Link>
          </Box>
          <Box>
            <Link href="/#board">Board</Link>
          </Box>
        </Stack>
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
              <Stack
                direction="row"
                marginLeft={16}
                marginY={0}
                spacing={8}
                textAlign="left"
                textTransform="uppercase"
                textUnderlineOffset="0.25rem"
                fontWeight={600}
                width="auto"
              >
                <Box>
                  <Link href="/#donate">Donate</Link>
                </Box>
                <Box>
                  <Link href="/scholarship">For Students</Link>
                </Box>
                <Box>
                  <Link href="/#sign-up">Newsletter</Link>
                </Box>
                <Box>
                  <Link href="/#about">About</Link>
                </Box>
                <Box>
                  <Link href="/#board">Board</Link>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Flex>
      </PageContainer>
      {children}
    </>
  );
};

export default PageWrapper;
