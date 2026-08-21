import React, { FunctionComponent } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { PageContainer } from './styleguide/page-container';

type ScholarCreditProps = {
  /** e.g. `Jane Doe, 2026 LWBF Scholar` */
  credit: string;
};

/**
 * Credit tab for a piece of scholar artwork: floats in the lower right of the
 * artwork it sits on, held to the page's max width so it lines up with the
 * gutters of everything else.
 *
 * Expects a `position: relative` ancestor.
 */
const ScholarCredit: FunctionComponent<ScholarCreditProps> = ({ credit }) => (
  <Box position="absolute" zIndex={2} bottom={[4, 6, 8]} left={0} right={0}>
    <PageContainer display="flex" justifyContent="flex-end">
      <Text
        as="p"
        margin={0}
        paddingX={[2, 3]}
        paddingY={[1, 2]}
        pointerEvents="auto"
        backgroundColor="rgba(0, 0, 0, 0.5)"
        color="white"
        textAlign="right"
        fontSize={['0.625rem']}
        lineHeight={1.5}
        letterSpacing="0.08em"
        textTransform="uppercase"
      >
        {credit}
      </Text>
    </PageContainer>
  </Box>
);

export default ScholarCredit;
