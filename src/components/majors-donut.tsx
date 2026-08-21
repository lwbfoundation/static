import React, { FunctionComponent } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

type Segment = Readonly<{
  label: string;
  value: number;
  color: string;
}>;

/**
 * Slice order walks the ring clockwise from 12 o'clock, which is also the order
 * that keeps every adjacent pair distinguishable under color-vision deficiency
 * (worst adjacent pair ΔE 12.1 protan). Reordering the ring can push two brand
 * colors next to each other that a protan/deutan reader can't separate.
 */
const SEGMENTS: Segment[] = [
  { label: 'Other', value: 7, color: '#E0CEC4' },
  { label: 'Industrial Design', value: 10, color: '#54622B' },
  { label: 'Graphic Design', value: 24, color: '#F26742' },
  { label: 'Architecture', value: 42, color: '#B7D4C0' },
  { label: 'Animation', value: 17, color: '#185B78' },
];

const OTHER_LABEL = 'Other';

/**
 * The legend is free to reorder because nothing about it depends on adjacency:
 * the catch-all reads last, the way it would in a list. The ring above stays in
 * its own order.
 */
const LEGEND: Segment[] = [
  ...SEGMENTS.filter(({ label }) => label !== OTHER_LABEL),
  ...SEGMENTS.filter(({ label }) => label === OTHER_LABEL),
];

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 64;
const STROKE_WIDTH = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// Two viewBox units of empty ring between fills, so the two pale brand colors
// never touch without a visible seam.
const SEGMENT_GAP = 2;
// White disc behind the ring so the chart reads against the artwork wash. Solid
// out to the ring's outer edge, then feathered, so it doesn't read as a sticker.
const BACKDROP_RADIUS = 98;
const BACKDROP_SOLID_STOP = `${
  ((RADIUS + STROKE_WIDTH / 2) / BACKDROP_RADIUS) * 100
}%`;
const BACKDROP_ID = 'majors-donut-backdrop';

const arcs = SEGMENTS.reduce<
  { segment: Segment; dash: number; offset: number }[]
>((acc, segment) => {
  const previous = acc[acc.length - 1];
  const offset = previous
    ? previous.offset + (previous.segment.value / 100) * CIRCUMFERENCE
    : 0;
  const dash = (segment.value / 100) * CIRCUMFERENCE - SEGMENT_GAP;
  return [...acc, { segment, dash, offset }];
}, []);

export interface MajorsDonutProps {
  readonly totalLabel?: string;
  readonly totalValue?: string;
}

const MajorsDonut: FunctionComponent<MajorsDonutProps> = ({
  totalValue = '29',
  totalLabel = 'scholars',
}) => (
  <Flex
    direction={['column', null, 'row']}
    align="center"
    justify="center"
    gridGap={[6, null, 12]}
  >
    <Box width={['16rem', '18rem']} flexShrink={0}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        height="auto"
        role="img"
        aria-label={`Scholar fields of study: ${LEGEND.map(
          ({ label, value }) => `${label} ${value}%`
        ).join(', ')}.`}
      >
        <defs>
          <radialGradient id={BACKDROP_ID}>
            <stop offset="0%" stopColor="#fff" stopOpacity={0.5} />
            <stop
              offset={BACKDROP_SOLID_STOP}
              stopColor="#fff"
              stopOpacity={0.25}
            />
            <stop offset="100%" stopColor="#fff" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={BACKDROP_RADIUS}
          fill={`url(#${BACKDROP_ID})`}
        />
        <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
          {arcs.map(({ segment, dash, offset }) => (
            <circle
              key={segment.label}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
              strokeDashoffset={-offset}
            >
              <title>{`${segment.label}: ${segment.value}%`}</title>
            </circle>
          ))}
        </g>
        <text
          x={CENTER}
          y={CENTER - 2}
          textAnchor="middle"
          fill="#185B78"
          fontSize={38}
          fontWeight={400}
        >
          {totalValue}
        </text>
        <text
          x={CENTER}
          y={CENTER + 20}
          textAnchor="middle"
          fill="#474747"
          fontSize={14}
        >
          {totalLabel}
        </text>
      </svg>
    </Box>
    <Box as="dl" margin={0} width={['100%', '18rem']} maxWidth="20rem">
      {LEGEND.map(({ label, value, color }) => (
        <Flex
          key={label}
          align="baseline"
          borderBottomWidth="1px"
          borderBottomColor="blackAlpha.200"
          paddingY={2}
        >
          <Box
            aria-hidden
            width="0.85rem"
            height="0.85rem"
            backgroundColor={color}
            flexShrink={0}
            marginRight={3}
            transform="translateY(0.1rem)"
          />
          <Text as="dt" color="gray.type" flexGrow={1} marginBottom={0}>
            {label}
          </Text>
          <Text
            as="dd"
            color="blue.brand"
            fontSize="lg"
            marginLeft={4}
            marginBottom={0}
          >
            {value}%
          </Text>
        </Flex>
      ))}
    </Box>
  </Flex>
);

export default MajorsDonut;
