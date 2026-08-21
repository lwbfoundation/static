import React, { FunctionComponent } from 'react';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import MajorsDonut from './majors-donut';
import GivingTuesdayVideo from './giving-tuesday-video';

type Stat = Readonly<{
  value: string;
  label: string;
}>;

const STATS: Stat[] = [
  { value: '$675K', label: 'Issued to scholars from 2022–2026' },
  { value: '$925K', label: 'Promised through 2030' },
  {
    value: '~50%',
    label: 'Come from the San Francisco Unified School District',
  },
  { value: '83%', label: 'Come from the Bay Area' },
];

const Results: FunctionComponent = () => (
  <>
    {/* Stands in for the section title, so the page keeps its heading outline. */}
    <Heading
      as="h2"
      variant="h3"
      color="gray.type"
      fontSize={['2xl', '3xl', '4xl']}
      lineHeight={1.25}
      textAlign="center"
      maxWidth={900}
      marginX="auto"
      marginBottom={[8, null, 12]}
    >
      Since 2022, we&rsquo;ve supported{' '}
      <Box as="span" color="orange.brand">
        29 scholars
      </Box>{' '}
      pursuing college degrees in{' '}
      <Box as="span" color="blue.brand">
        design
      </Box>
      .
    </Heading>
    <Grid
      as="dl"
      margin={0}
      marginBottom={[8, null, 16]}
      templateColumns={['repeat(2, 1fr)', null, 'repeat(4, 1fr)']}
      gap={[2, 4]}
    >
      {STATS.map(({ value, label }) => (
        <Box
          key={value}
          backgroundColor="mint.brandlight"
          paddingX={[4, 6]}
          paddingY={[5, 6]}
          textAlign="center"
        >
          <Text
            as="dt"
            color="blue.brand"
            fontSize={['3xl', null, '4xl']}
            lineHeight={1.1}
            marginBottom={2}
          >
            {value}
          </Text>
          <Text as="dd" color="gray.type" fontSize="sm" marginBottom={0}>
            {label}
          </Text>
        </Box>
      ))}
    </Grid>
    <Heading
      as="h3"
      variant="h3"
      fontSize="3xl"
      textAlign="center"
      marginBottom={[6, null, 8]}
    >
      What our scholars study
    </Heading>
    <Flex
      direction={['column', null, 'row']}
      align="center"
      justify="center"
      gridGap={[8, null, 20]}
    >
      <Box>
        <MajorsDonut />
      </Box>
      {/* Right of the chart on desktop, below it on a phone. */}
      <Box
        flexShrink={0}
        width={['80%', null, '16rem']}
        maxWidth={['400px', null, 'none']}
      >
        <GivingTuesdayVideo />
      </Box>
    </Flex>
  </>
);

export default Results;
