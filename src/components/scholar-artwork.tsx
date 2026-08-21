import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Box } from '@chakra-ui/react';
import ScholarCredit from './scholar-credit';

const CREDIT = 'Jesus Guillermo Macias Franco, 2022 Scholar';

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
          )
        }
      }
    }
  `);

  return (
    <Box
      marginTop={['-55vw', '-60vw', '-66vw']}
      position="relative"
      zIndex={-1}
      pointerEvents="none"
    >
      <GatsbyImage
        image={data.artwork.childImageSharp.gatsbyImageData}
        alt={`No Room for Walls, architectural collage by ${CREDIT}`}
      />
      <Box
        aria-hidden
        position="absolute"
        zIndex={1}
        top={0}
        right={0}
        bottom={0}
        left={0}
        backgroundImage="linear-gradient(to bottom, rgba(255,255,255,1) 0%,  rgba(255,255,255,0.65) 100%)"
      />
      <ScholarCredit credit={CREDIT} />
    </Box>
  );
};

export default ScholarArtwork;
