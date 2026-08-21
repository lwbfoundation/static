import React, { FunctionComponent } from 'react';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import MajorsDonut, { DONUT_GAP } from './majors-donut';
import GivingTuesdayVideo from './giving-tuesday-video';

/**
 * The chart, its legend and the film only sit side by side without crowding
 * once there is about 1020px to put them in — past Chakra's `lg`, so this is a
 * one-off query rather than a theme breakpoint, which would shift the meaning
 * of every responsive array on the site.
 */
export const SIDE_BY_SIDE = '@media (min-width: 1024px)';

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

/**
 * The stat grid is two columns until `md` and a single row from `md` up, so
 * which box owns which outer corner changes at that breakpoint — see the
 * Grid's `templateColumns`, which has to flip at the same place.
 */
const COLUMNS_BELOW_MD = 2;
/** First box on the bottom row of the two-column grid. */
const LAST_ROW_START =
  Math.floor((STATS.length - 1) / COLUMNS_BELOW_MD) * COLUMNS_BELOW_MD;
/**
 * 1.5x Chakra's `xl` (0.75rem). Written as a raw length rather than a token
 * because nothing in the scale lands on it — `2xl` is 1rem and `3xl` is 1.5rem.
 */
const GROUP_RADIUS = '1.125rem';

const Results: FunctionComponent = () => (
  <>
    {/* Stands in for the section title, so the page keeps its heading outline. */}
    <Heading
      as="h2"
      variant="h3"
      color="gray.type"
      fontSize={['2xl', '3xl', '4xl']}
      fontWeight={[600, null, 400]}
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
      {STATS.map(({ value, label }, index) => {
        /* Below `md` the four outer corners of the block are spread across four
           different boxes; from `md` the row has only two outside edges, and
           the first and last box take both corners on their own side. */
        const isFirst = index === 0;
        const isLast = index === STATS.length - 1;
        const isGridTopRight = index === COLUMNS_BELOW_MD - 1;
        const isGridBottomLeft = index === LAST_ROW_START;

        return (
          <Box
            key={value}
            backgroundColor="mint.brandlight"
            paddingX={[4, 6]}
            paddingY={[5, 6]}
            textAlign="center"
            borderTopLeftRadius={[
              isFirst ? GROUP_RADIUS : 0,
              null,
              isFirst ? GROUP_RADIUS : 0,
            ]}
            borderTopRightRadius={[
              isGridTopRight ? GROUP_RADIUS : 0,
              null,
              isLast ? GROUP_RADIUS : 0,
            ]}
            borderBottomLeftRadius={[
              isGridBottomLeft ? GROUP_RADIUS : 0,
              null,
              isFirst ? GROUP_RADIUS : 0,
            ]}
            borderBottomRightRadius={[
              isLast ? GROUP_RADIUS : 0,
              null,
              isLast ? GROUP_RADIUS : 0,
            ]}
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
            <Text
              as="dd"
              color="gray.type"
              fontSize="sm"
              marginBottom={0}
              fontWeight={600}
            >
              {label}
            </Text>
          </Box>
        );
      })}
    </Grid>
    <Heading
      as="h3"
      variant="h3"
      fontSize={['3xl', null, '6xl']}
      fontWeight={400}
      textAlign="center"
      marginBottom={[6, null, 8]}
      marginTop={[20, null, 32]}
    >
      Our scholars study{' '}
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          transform: 'translateY(0.3em)',
        }}
      >
        ⤵
      </span>
    </Heading>
    <Flex
      direction="column"
      align="center"
      justify="center"
      gridGap={8}
      sx={{ [SIDE_BY_SIDE]: { flexDirection: 'row', gap: DONUT_GAP } }}
    >
      <Box>
        <MajorsDonut />
      </Box>
      {/* Right of the chart once there is room, below it until then. */}
      <Box
        flexShrink={0}
        width="80%"
        maxWidth="400px"
        sx={{ [SIDE_BY_SIDE]: { width: '16rem', maxWidth: 'none' } }}
      >
        <GivingTuesdayVideo />
      </Box>
    </Flex>
  </>
);

export default Results;
