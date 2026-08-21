import React, { FunctionComponent } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

type Segment = Readonly<{
  label: string;
  value: number;
  color: string;
}>;

/**
 * Slices walk the ring clockwise from 12 o'clock, largest first.
 *
 * Ordering by size closes the ring on the two palest brand colors, mint and
 * tan. They sit within a point of each other in lightness and separate only by
 * hue, which is exactly what a protan/deutan reader loses, so the gap below is
 * what holds them apart — widen it before narrowing it.
 */
const SEGMENTS: Segment[] = [
  { label: 'Architecture', value: 42, color: '#B7D4C0' },
  { label: 'Graphic Design', value: 24, color: '#F26742' },
  { label: 'Animation', value: 17, color: '#185B78' },
  { label: 'Industrial Design', value: 10, color: '#54622B' },
  { label: 'Other', value: 7, color: '#E0CEC4' },
];

const OTHER_LABEL = 'Other';

/**
 * The legend is free to reorder because nothing about it depends on adjacency:
 * the catch-all reads last, the way it would in a list. That already matches
 * the ring's size order, since `Other` is the smallest slice.
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
// A white wash behind the ring so the chart reads against the artwork without
// looking like a sticker: it thins to half by the ring's outer edge, then falls
// away entirely.
const BACKDROP_RADIUS = 98;
const BACKDROP_RING_EDGE = `${
  ((RADIUS + STROKE_WIDTH / 2) / BACKDROP_RADIUS) * 100
}%`;
const BACKDROP_STOPS = [
  { offset: '0%', opacity: 0.43 },
  { offset: BACKDROP_RING_EDGE, opacity: 0.21 },
  { offset: '100%', opacity: 0 },
];
const BACKDROP_ID = 'majors-donut-backdrop';
// The ring stops short of the viewBox by the width of the backdrop that fades
// out around it, so the element the chart draws into is wider than the ring by
// this much on every side. That room is blank to the eye, which leaves the flex
// gap beside the legend reading as half again as wide as the one past it.
// Pulling the element back in by the same amount sets its edges on the ring, so
// the donut, the legend and the film are spaced by the gap alone.
const RING_INSET = (CENTER - (RADIUS + STROKE_WIDTH / 2)) / SIZE;
const DONUT_WIDTHS = ['16rem', '18rem'];
const DONUT_MARGINS = DONUT_WIDTHS.map(
  (width) => `calc(${width} * -${RING_INSET})`
);
// The legend's own wash. It traces its falloff across more stops than the
// ring's, because it backs a block of text rather than a band of colour:
// gradients interpolate linearly between stops, so three are enough for a band
// but would bend visibly across an area this size.
const LEGEND_STOPS = [
  { offset: '0%', opacity: 0.43 },
  { offset: '25%', opacity: 0.41 },
  { offset: '45%', opacity: 0.35 },
  { offset: '62%', opacity: 0.27 },
  { offset: '76%', opacity: 0.2 },
  { offset: '87%', opacity: 0.12 },
  { offset: '95%', opacity: 0.05 },
  { offset: '100%', opacity: 0 },
];
// An ellipse rather than a circle, so it follows the block's shape.
const LEGEND_BACKDROP = `radial-gradient(closest-side, ${LEGEND_STOPS.map(
  ({ offset, opacity }) => `rgba(255, 255, 255, ${opacity}) ${offset}`
).join(', ')})`;
const LEGEND_PADDING = '1.5rem';
/**
 * A background cannot paint outside its element, so the wash rides on a layer
 * of its own behind the list, sized half again as large as the block it backs:
 * a quarter of that block's width and height past each edge. Insets on an
 * absolutely positioned layer resolve against its containing block -- top and
 * bottom against its height, not its width -- so the layer comes out at 1.5x
 * the legend in both directions whatever the legend measures. The falloff then
 * happens outside the list rather than across its text.
 *
 * That only works where the section has room to absorb the overhang. Below
 * `lg` the legend is close enough to the width of the page that the wash would
 * run past the viewport and be cut off mid-fade, leaving a visible edge, so
 * there the layer keeps to the block and the fade lands on its border as it
 * did before.
 */
const LEGEND_OVERHANG = [0, null, null, '-25%'];
/**
 * The gap between the ring and its legend. On a wide screen the film sits
 * beside the two of them in the same row, so `results.tsx` spaces itself by
 * this as well: the three read as evenly spaced only while both gaps are the
 * one number.
 */
export const DONUT_GAP = '3rem';

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
    gridGap={[6, null, DONUT_GAP]}
  >
    <Box width={DONUT_WIDTHS} marginX={DONUT_MARGINS} flexShrink={0}>
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
            {BACKDROP_STOPS.map(({ offset, opacity }) => (
              <stop
                key={offset}
                offset={offset}
                stopColor="#fff"
                stopOpacity={opacity}
              />
            ))}
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
    <Box position="relative" width={['100%', '21rem']} maxWidth="23rem">
      <Box
        aria-hidden
        position="absolute"
        top={LEGEND_OVERHANG}
        right={LEGEND_OVERHANG}
        bottom={LEGEND_OVERHANG}
        left={LEGEND_OVERHANG}
        backgroundImage={LEGEND_BACKDROP}
        pointerEvents="none"
      />
      <Box as="dl" margin={0} padding={LEGEND_PADDING} position="relative">
        {LEGEND.map(({ label, value, color }, i) => (
          <Flex
            key={label}
            align="baseline"
            borderBottomWidth={i < LEGEND.length - 1 ? '1px' : 0}
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
            <Text
              as="dt"
              color="gray.type"
              fontWeight={600}
              flexGrow={1}
              marginBottom={0}
            >
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
    </Box>
  </Flex>
);

export default MajorsDonut;
