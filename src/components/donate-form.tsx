import { Box, Text } from '@chakra-ui/react';
import { graphql, useStaticQuery } from 'gatsby';
import React, { lazy, ReactElement, Suspense } from 'react';
import PostBody from './post-body';

const LazyDonate = lazy(() => import('./donate/donate'));

export function DonateForm(): ReactElement {
  const data = useStaticQuery(graphql`
    query {
      wpCommonSiteSettings {
        customCommonDataFields {
          donatebuttontext
          donateformexplainer
          legalinfo
        }
      }
    }
  `);

  return (
    <Suspense fallback={<Box height={600} />}>
      <Box
        backgroundColor="#F4F9F9"
        paddingX={[2, 8]}
        paddingY={6}
        borderRadius={[0, 10]}
      >
        <Text as="div" fontSize={['1em', '1.4em']} marginBottom={8}>
          <PostBody
            body={
              data.wpCommonSiteSettings.customCommonDataFields
                .donateformexplainer
            }
          />
        </Text>
        <LazyDonate
          donateButtonText={
            data.wpCommonSiteSettings.customCommonDataFields.donatebuttontext
          }
        />
        <Text marginTop={8} marginBottom={4}>
          Secure payments provided by{' '}
          <a href="https://www.stripe.com" rel="noreferrer" target="_blank">
            Stripe
          </a>
          .
        </Text>
        <PostBody
          body={data.wpCommonSiteSettings.customCommonDataFields.legalinfo}
        />
      </Box>
    </Suspense>
  );
}
