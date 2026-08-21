import React, { FunctionComponent } from 'react';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { PageContainer } from './styleguide/page-container';
import ScholarFaceDeck from './scholar-faces';

const YEAR = '2026';
const HREF = `/scholarship/recipients/${YEAR}-recipients`;
const CTA = `Meet the class of ${YEAR}`;

/**
 * A full-bleed brand-blue band: the standing claim, and the year to click. The
 * button names the class, so nothing above it needs to. Only `YEAR` moves when
 * the next class is published.
 *
 * Every scholar the foundation has funded sits behind the headline.
 */
const AnnouncementBanner: FunctionComponent = () => (
  <Box
    position="relative"
    overflow="hidden"
    backgroundColor="blue.brand"
    color="white"
    marginY={[8, 12]}
    // The type steps up twice on the way out from a phone, so the content grows
    // at each breakpoint while the band is meant to hold its height. Padding
    // gives way to make that room: it is at its most generous on the narrowest
    // screen, where the headline is smallest.
    paddingY={[14, 5, 20]}
    // The headline has less room at 768 than at 1280, so it wraps to more lines
    // and the band stands taller there. A floor at each step's narrow end stops
    // it collapsing as the viewport widens, and the flex centring keeps the
    // content in the middle of that floor. The first floor is the height the
    // band reaches just under `sm`, so nothing jumps at the breakpoint.
    minHeight={[null, '15rem', '21.25rem']}
    display="flex"
    alignItems="center"
  >
    <ScholarFaceDeck />
    <PageContainer position="relative" zIndex={1}>
      <Flex
        direction={['column', null, 'row']}
        align={['flex-start', null, 'flex-end']}
        justify="space-between"
        gridGap={[5, null, 10]}
      >
        <Heading
          as="p"
          variant="h3"
          color="white"
          margin={0}
          fontSize={['1.75rem', '2.5rem', '3rem']}
          lineHeight={1.1}
        >
          We back a new class of brilliant design students.{' '}
          <Box as="span" color="mint.brand">
            Every year.
          </Box>
        </Heading>
        <Button
          as="a"
          href={HREF}
          flexShrink={0}
          height={12}
          paddingX={8}
          fontSize="md"
          backgroundColor="orange.brand"
          color="white"
          textDecoration="none"
          _hover={{ backgroundColor: 'orange.brand' }}
        >
          {CTA} &rarr;
        </Button>
      </Flex>
    </PageContainer>
  </Box>
);

export default AnnouncementBanner;
