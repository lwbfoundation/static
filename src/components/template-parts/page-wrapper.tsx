import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, Flex, Link, Stack } from '@chakra-ui/react';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { PageTemplateProps } from '../../templates/single/Page';
import HeadContent from '../head-content';
import { PageContainer } from '../styleguide/page-container';
import Logo from '../../assets/svg/logo.inline.svg';

const PageWrapper: FunctionComponent<PropsWithChildren<PageTemplateProps>> = ({
  data,
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const MenuIcon = isMenuOpen ? CloseIcon : HamburgerIcon;

  return (
    <>
      <HeadContent title={data.wpCommonSiteSettings.title} />
      <PageContainer
        marginTop={[0, null, 8]}
        backgroundColor={['blue.brand', null, 'transparent']}
      >
        <Flex alignItems="center">
          <Box display={['none', null, 'block']}>
            <Link href="/">
              <Logo
                alt={data.wpCommonSiteSettings.title}
                height={84}
                width={84 * 1.85}
              />
            </Link>
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
              textUnderlineOffset="0.25rem"
              fontWeight={600}
              width={['100%', null, 'auto']}
              display={[isMenuOpen ? 'flex' : 'none', null, 'flex']}
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
        </Flex>
      </PageContainer>
      {children}
    </>
  );
};

export default PageWrapper;
