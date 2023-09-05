import { Box, Container, Flex, Link, Text } from '@chakra-ui/react';
import React, { FunctionComponent } from 'react';
import { PageTemplateProps } from '../../templates/single/Page';
import PostBody from '../post-body';
import Logo from '../../assets/svg/logo.inline.svg';
import Instagram from '../../assets/svg/social/instagram.inline.svg';

const Footer: FunctionComponent<PageTemplateProps> = ({ data }) => {
  return (
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
          <Box width={['100%', '100%', 'auto']} marginTop={['auto', 4, 'auto']}>
            <a
              href="https://www.guidestar.org/profile/shared/824b931a-4cc6-4cf5-a440-8ce32f01a524"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <img
                src="https://widgets.guidestar.org/TransparencySeal/9955646"
                alt="Guidestar Transparency Seal"
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
            </a>
          </Box>
          <Box
            width={['100%', '100%', 'auto']}
            marginTop={4}
            marginLeft={[0, 0, 8]}
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
  );
};

export default Footer;
