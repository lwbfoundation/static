import React, { FunctionComponent } from 'react';
import { Heading, Box, Text } from '@chakra-ui/core';
import PostBody from '../post-body';
import HeadContent from '../head-content';
import { PageTemplateProps } from '../../templates/single/Page';
import AspectRatioResponsive from '../aspect-ratio-responsive';
import FormsContainer from '../forms-container';

const Homepage: FunctionComponent<PageTemplateProps> = ({ data }) => (
  <>
    <AspectRatioResponsive width="100%" ratio={[1, 1.85 / 1, null, 2.5 / 1]}>
      <Box
        backgroundColor="gray.600"
        backgroundImage="url(/images/javier-trueba-iQPr1XkF5F0-unsplash.jpg)"
        backgroundSize="cover"
        overflow="visible"
      >
        <AspectRatioResponsive
          width="100%"
          ratio={[1, 1.85 / 1, null, 2.5 / 1]}
        >
          <Box backgroundColor="blackAlpha.700">
            <Text as="div" textAlign="center" color="white" paddingX="1rem">
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
      </Box>
    </AspectRatioResponsive>
    <FormsContainer
      donateButtonText={data.page.customHomepageOptions.donatebuttontext}
      emailSignupButtonText={
        data.page.customHomepageOptions.newslettersignupbuttontext
      }
      legalInfo={data.page.customHomepageOptions.legalinfo}
    />
    <Box marginX={[2, 4]}>
      <Box maxWidth={800} marginX="auto" marginBottom={16}>
        <Text as="div" fontSize="1.4em" textAlign="justify">
          <PostBody body={data.page.content} />
        </Text>
      </Box>
    </Box>
    <Box width="100%" backgroundColor="gray.600" paddingX={[2, 4]} paddingY={6}>
      <Text color="white" fontSize="sm" textAlign={['left', 'center']}>
        <PostBody body={data.page.customHomepageOptions.legalinfo} />
      </Text>
    </Box>
  </>
);

export default Homepage;
