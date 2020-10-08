import React, { FunctionComponent } from 'react';
import { Heading, Box, Text } from '@chakra-ui/core';
import PostBody from '../post-body';
import HeadContent from '../head-content';
import Donate from '../donate/donate';
import EmailSignup from '../newsletter-signup';
import { PageTemplateProps } from '../../templates/single/Page';
import AspectRatioResponsive from '../aspect-ratio-responsive';
import FormsContainer from '../forms-container';

const Homepage: FunctionComponent<PageTemplateProps> = ({ data }) => (
  <>
    <AspectRatioResponsive width="100%" ratio={[1, 1.85 / 1, null, 2.5 / 1]}>
      <Box backgroundColor="gray.600" overflow="visible">
        <Text as="div" textAlign="center" color="white">
          <HeadContent title={data.wp.generalSettings.title} />
          <Heading
            as="h1"
            fontWeight={200}
            textTransform="uppercase"
            letterSpacing={4}
            fontFamily="Trade Gothic, Helvetica"
          >
            {data.wp.generalSettings.title}
          </Heading>
          <PostBody body={data.page.customHomepageOptions.subheading} />
        </Text>
      </Box>
    </AspectRatioResponsive>
    <FormsContainer
      donateButtonText={data.page.customHomepageOptions.donatebuttontext}
      emailSignupButtonText={
        data.page.customHomepageOptions.newslettersignupbuttontext
      }
    />
    <Box marginX={[1, 4]}>
      <Box maxWidth={800} marginX="auto">
        <Text as="div" fontSize="1.4em">
          <PostBody body={data.page.content} />
        </Text>
      </Box>
    </Box>
    <PostBody body={data.page.customHomepageOptions.legalinfo} />
  </>
);

export default Homepage;
