import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Box, Flex, keyframes } from '@chakra-ui/react';

type PeopleCarouselData = {
  photos: {
    nodes: {
      id: string;
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData;
      };
    }[];
  };
};

/** Row height per breakpoint; each photo's width follows from its own ratio.
    The photos butt up against each other, so the strip reads as one band. */
const HEIGHTS = [144, 192, 306];
/** One full pass of the strip. Long enough to read as a drift, not a slide. */
const DURATION = '80s';

// The row holds two identical copies of the strip, so shifting it by exactly
// half its width lands the second copy where the first started — no seam, no
// jump back to the beginning.
const drift = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
`;

const PeopleCarousel: FunctionComponent = () => {
  const data: PeopleCarouselData = useStaticQuery(graphql`
    {
      photos: allFile(
        filter: { relativeDirectory: { eq: "people" } }
        sort: { fields: relativePath, order: ASC }
      ) {
        nodes {
          id
          childImageSharp {
            gatsbyImageData(height: 640, quality: 78, layout: CONSTRAINED)
          }
        }
      }
    }
  `);

  const photos = data.photos.nodes;
  if (photos.length === 0) return null;

  return (
    <Box
      role="img"
      aria-label="Photos from Lewis W. Butler Foundation events and scholar gatherings"
      overflowX="hidden"
      // The strip sits back at half strength so it reads as texture behind the
      // page, and comes up to full when someone hovers or taps it.
      opacity={0.67}
      transition="opacity 400ms ease"
      _hover={{ opacity: 1 }}
      _active={{ opacity: 1 }}
      _focusWithin={{ opacity: 1 }}
      sx={{
        // Nothing should be moving under a reduced-motion preference, so the
        // strip parks and becomes an ordinary scrollable row instead.
        '@media (prefers-reduced-motion: reduce)': {
          overflowX: 'auto',
        },
      }}
    >
      <Flex
        width="max-content"
        animation={`${drift} ${DURATION} linear infinite`}
        sx={{
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}
      >
        {[...photos, ...photos].map(({ id, childImageSharp }, index) => {
          const image = childImageSharp.gatsbyImageData;
          const ratio = image.width / image.height;
          return (
            <Box
              // The second copy is the same photos in the same order, so the
              // index is what makes each key unique.
              // eslint-disable-next-line react/no-array-index-key
              key={`${id}-${index}`}
              flexShrink={0}
              height={HEIGHTS.map((height) => `${height}px`)}
              width={HEIGHTS.map((height) => `${Math.round(height * ratio)}px`)}
            >
              <GatsbyImage
                image={image}
                alt=""
                style={{ height: '100%', width: '100%' }}
              />
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};

export default PeopleCarousel;
