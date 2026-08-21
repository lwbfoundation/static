import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Box, BoxProps, Heading, Text } from '@chakra-ui/react';
import PostBody from './post-body';
import { PageContainer } from './styleguide/page-container';
import NewsletterSignupForm from './newsletter-signup/newsletter-signup';

/**
 * The newsletter signup, always on the page rather than revealed by a hash.
 * `#sign-up` links (the main menu, the hero button when applications are
 * closed) now scroll here instead of toggling a form open, so the form is in
 * the served HTML and is reachable without JavaScript running first.
 *
 * Spacing is left to the caller past the default, since this sits mid-page on
 * the homepage but directly under the title on /news/.
 */
const NewsletterSection: FunctionComponent<BoxProps> = ({ ...rest }) => {
  const data = useStaticQuery(graphql`
    query {
      wpCommonSiteSettings {
        customCommonDataFields {
          newslettersignupexplainer
        }
      }
    }
  `);

  const explainer =
    data.wpCommonSiteSettings.customCommonDataFields.newslettersignupexplainer;

  return (
    <Box as="section" id="sign-up" marginTop={[16]} {...rest}>
      <PageContainer>
        <Box
          maxWidth={600}
          marginX="auto"
          backgroundColor="#F4F9F9"
          paddingX={[4, 8]}
          paddingY={[6, 8]}
          borderRadius={[0, 10]}
        >
          <Heading as="h2" variant="h3" fontSize={['2xl', '3xl']} marginTop={0}>
            Stay updated
          </Heading>
          {explainer && (
            <Text as="div" fontSize={['1em', '1.4em']} marginY={4}>
              <PostBody body={explainer} />
            </Text>
          )}
          <NewsletterSignupForm signupButtonText="Sign up" />
        </Box>
      </PageContainer>
    </Box>
  );
};

export default NewsletterSection;
