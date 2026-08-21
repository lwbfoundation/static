import {
  Box,
  Container,
  Flex,
  HStack,
  Icon,
  Link,
  Text,
} from '@chakra-ui/react';
import React, { FunctionComponent } from 'react';
import { PageTemplateProps } from '../../templates/single/Page';
import PostBody from '../post-body';
import Logo from '../../assets/svg/logo.inline.svg';
import Instagram from '../../assets/svg/social/instagram.inline.svg';
import { FiMail } from 'react-icons/fi';

type FooterProps = PageTemplateProps & {
  /** Drop the gap above the orange band, for pages that run artwork into it. */
  flush?: boolean;
};

const Footer: FunctionComponent<FooterProps> = ({ data, flush = false }) => {
  return (
    // `position: sticky` with `top: 100vh` keeps the footer in normal flow on
    // long pages, but pins it to the bottom of the viewport on short ones —
    // PageWrapper gives it a 100vh-tall parent to be pinned against.
    <Box
      backgroundColor="orange.brand"
      color="white"
      position="sticky"
      top="100vh"
    >
      <Container
        maxWidth="container.lg"
        marginTop={flush ? 0 : [4, 8, 16]}
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
                body={data.wpCommonSiteSettings.customCommonDataFields.address}
              />
              <Link
                href={`mailto:${data.wpCommonSiteSettings.customCommonDataFields.contactemail}`}
                textDecoration="none"
              >
                {data.wpCommonSiteSettings.customCommonDataFields.contactemail}
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
            width={['100%', '100%', 'auto']}
            marginTop={4}
            marginLeft={[0, 0, 8]}
            textAlign={['center', 'center', 'right']}
          >
            <HStack
              spacing={3}
              justifyContent={['center', 'center', 'flex-end']}
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
              {/* Feather's mail glyph set into a white disc, so it reads as the
                  same badge shape as the Instagram mark beside it. */}
              <Link
                href="mailto:info@lewiswbutlerfoundation.org"
                aria-label="Email the Lewis W. Butler Foundation"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxSize="40px"
                borderRadius="full"
                backgroundColor="white"
              >
                <Icon as={FiMail} boxSize="22px" color="orange.brand" />
              </Link>
            </HStack>
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
  );
};

export default Footer;
