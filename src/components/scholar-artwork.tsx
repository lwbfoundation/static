import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Box } from '@chakra-ui/react';
import ScholarCredit from './scholar-credit';
import { SIDE_BY_SIDE } from './results';

const CREDIT = 'Jesus Guillermo Macias Franco, 2022 Scholar';

/**
 * Until the results section closes into a single row it stays tall and stacked,
 * and its height barely moves with the viewport: the chart, the legend and the
 * film are fixed widths in a column, so the section runs about 1600-1900px at
 * every width below the switch. A band measured in `vw` cannot follow that. It
 * used to, keyed to `sm`, which collapsed it from 1150px to 384px the moment a
 * phone was turned on its side and left almost none of the collage showing.
 * Holding it to a fixed reach instead keeps the same share of the section
 * covered from the narrowest phone up to the row.
 */
const STACKED_REACH = '46rem';
/** Artwork left showing between the results section and the blue band below. */
const STACKED_RUN_OUT = '11rem';
const STACKED_HEIGHT = `calc(${STACKED_REACH} + ${STACKED_RUN_OUT})`;

/**
 * Stacked, only a low band of the artwork is ever on screen, so the scrim
 * clears completely over the lower fifth and lets the collage read. Once the
 * row closes up there is much more of it in view at once, and an even wash is
 * enough to hold the text above it.
 */
const STACKED_SCRIM =
  'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 80%, rgba(255,255,255,0) 100%)';
const ROW_SCRIM =
  'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0.50) 100%)';
const ROW_REACH = '-66vw';
const ROW_HEIGHT = '80vw';

type ScholarArtworkData = {
  artwork: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
};

/**
 * Full-bleed scholar artwork that bridges the white page into the blue Lewis
 * bio section. It is pulled up far enough to sit behind the whole results
 * section, where a full-height white scrim holds it to a wash that gathers
 * strength as it reaches the hard blue edge below. The credit sits on the
 * artwork as a tab floating in the lower right, held to the page's max width.
 */
const ScholarArtwork: FunctionComponent = () => {
  const data: ScholarArtworkData = useStaticQuery(graphql`
    {
      artwork: file(
        relativePath: { eq: "no-room-for-walls-macias-franco.jpg" }
      ) {
        childImageSharp {
          gatsbyImageData(
            quality: 75
            layout: FULL_WIDTH
            placeholder: BLURRED
            aspectRatio: 1.25
            transformOptions: { cropFocus: WEST }
            # Stacked, the band is 57rem tall and crops a tall sliver of the
            # 1.25 frame, so the source has to be 57rem * 16 * 1.25 = 1140px
            # wide to stay sharp there whatever the viewport. 1023px is the
            # width below SIDE_BY_SIDE; neither can be interpolated, since
            # Gatsby extracts this query at build time.
            sizes: "(max-width: 1023px) 1140px, 100vw"
          )
        }
      }
    }
  `);

  return (
    <Box
      marginTop={`-${STACKED_REACH}`}
      sx={{ [SIDE_BY_SIDE]: { marginTop: ROW_REACH } }}
      position="relative"
      zIndex={-1}
      pointerEvents="none"
    >
      {/* Stacked, the band is far taller than it is on a row and takes a
          narrow crop of the artwork to fill it. On the row it is close to the
          image's own 1.25 ratio, near enough uncropped. */}
      <Box
        height={STACKED_HEIGHT}
        sx={{ [SIDE_BY_SIDE]: { height: ROW_HEIGHT } }}
      >
        <GatsbyImage
          image={data.artwork.childImageSharp.gatsbyImageData}
          alt={`No Room for Walls, architectural collage by ${CREDIT}`}
          objectFit="cover"
          style={{ height: '100%', width: '100%' }}
        />
      </Box>
      <Box
        aria-hidden
        position="absolute"
        zIndex={1}
        top={0}
        right={0}
        bottom={0}
        left={0}
        backgroundImage={STACKED_SCRIM}
        sx={{ [SIDE_BY_SIDE]: { backgroundImage: ROW_SCRIM } }}
      />
      <ScholarCredit credit={CREDIT} />
    </Box>
  );
};

export default ScholarArtwork;
