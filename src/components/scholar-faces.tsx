import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Box, BoxProps, Flex } from '@chakra-ui/react';

type ScholarFace = {
  id: string;
  image: IGatsbyImageData;
};

type ScholarFacesData = {
  scholars: {
    nodes: {
      id: string;
      title: string;
      scholarshipRecipientDetails: { isanonymous: boolean };
      featuredImage: {
        node: {
          localFile: {
            childImageSharp: { gatsbyImageData: IGatsbyImageData };
          } | null;
        };
      } | null;
    }[];
  };
};

/** Scholars who should not appear in the montage, by the name on their page. */
const EXCLUDED = ['gabrielle nicolas'];

/**
 * Every scholar with a portrait. Anyone listed anonymously, or named in
 * `EXCLUDED`, is left out.
 */
const useScholarFaces = (): ScholarFace[] => {
  const { scholars }: ScholarFacesData = useStaticQuery(graphql`
    {
      scholars: allWpScholarshipRecipient(limit: 999) {
        nodes {
          id
          title
          scholarshipRecipientDetails {
            isanonymous
          }
          featuredImage {
            node {
              localFile {
                childImageSharp {
                  gatsbyImageData(
                    quality: 55
                    width: 240
                    height: 240
                    layout: CONSTRAINED
                  )
                }
              }
            }
          }
        }
      }
    }
  `);

  return scholars.nodes
    .filter(
      (node) =>
        !node.scholarshipRecipientDetails.isanonymous &&
        !EXCLUDED.includes(node.title.trim().toLowerCase())
    )
    .map((node) => ({
      id: node.id,
      image:
        node.featuredImage?.node.localFile?.childImageSharp.gatsbyImageData,
    }))
    .filter((face): face is ScholarFace => Boolean(face.image));
};

/**
 * Size and overlap both push the row wider than the band at every width, so
 * where the deck sits is a question of which end is pinned. A phone closes the
 * cards up and centres them, since the row overshoots the screen there whatever
 * we do. Desktop pins the right end instead -- see `DECK_END`.
 */
const SIZE = ['112px', null, '110px'];
const CARD_OVERLAP = ['-1.25rem', null, '-0.5rem'];
const ROW_OVERLAP = '-0.75rem';
/** Half a card's pitch, so the lower row sits in the gaps of the upper one. */
const ROW_OFFSET = '2.25rem';
/**
 * On desktop the cards right-align to this much short of the band's right edge,
 * which puts the last of them around the button and leaves the corner it sits
 * in clear. The overflow all runs off the left, so the deck stays put as
 * classes are added: a longer row spills further left rather than creeping back
 * across the button. Anchoring the edge only works if scaling leaves it alone,
 * hence the origin below.
 */
const DECK_END = '22%';
const DECK_WIDTH = ['100%', null, 'auto'];
const DECK_ORIGIN = ['center', null, '100% 50%'];
const DECK_JUSTIFY = ['center', null, 'flex-end'];
const ROWS = 2;
/**
 * Two rows of cards come to a little under half the band's height unscaled,
 * which leaves it looking bare. Doubling them fills it. Card size and overlap
 * are untouched: this scales what is already there.
 */
const DECK_SCALE = ['scale(1.4)', null, 'scale(2)'];
const tilt = (index: number): number =>
  (index % 2 ? 1 : -1) * (2 + (index % 3));

type FaceProps = BoxProps & { face: ScholarFace };

const Face: FunctionComponent<FaceProps> = ({ face, ...rest }) => (
  <Box
    flexShrink={0}
    width={SIZE}
    height={SIZE}
    marginX={CARD_OVERLAP}
    borderRadius="0.75rem"
    overflow="hidden"
    {...rest}
  >
    <GatsbyImage
      image={face.image}
      alt=""
      style={{ height: '100%', width: '100%' }}
    />
  </Box>
);

/**
 * Every scholar the foundation has funded, as two even rows of overlapping,
 * slightly tilted cards, the lower row offset so the two interlock. Decorative
 * only: blended to the band's own colour and knocked well back, so it reads as
 * texture rather than as photographs.
 */
const ScholarFaceDeck: FunctionComponent = () => {
  const faces = useScholarFaces();
  if (faces.length === 0) return null;

  // Chunked evenly rather than left to wrap, which would fill each row to
  // capacity and leave the last one short.
  const perRow = Math.ceil(faces.length / ROWS);
  const rows = Array.from({ length: ROWS }, (unused, row) =>
    faces.slice(row * perRow, (row + 1) * perRow)
  ).filter((row) => row.length > 0);

  return (
    <Box
      aria-hidden
      pointerEvents="none"
      position="absolute"
      left={0}
      right={[null, null, DECK_END]}
      top={0}
      bottom={0}
      width={DECK_WIDTH}
      transform={DECK_SCALE}
      transformOrigin={DECK_ORIGIN}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      opacity={0.2}
      sx={{ mixBlendMode: 'luminosity' }}
    >
      {rows.map((row, rowIndex) => (
        <Flex
          key={row[0].id}
          justify={DECK_JUSTIFY}
          marginY={ROW_OVERLAP}
          // The offset has to come off whichever end the row is pinned by: a
          // left margin would not move content that is aligned to the right.
          marginLeft={rowIndex === 1 ? [ROW_OFFSET, null, 0] : undefined}
          marginRight={rowIndex === 1 ? [0, null, ROW_OFFSET] : undefined}
        >
          {row.map((face, index) => (
            <Face
              key={face.id}
              face={face}
              transform={`rotate(${tilt(index + rowIndex * 3)}deg)`}
            />
          ))}
        </Flex>
      ))}
    </Box>
  );
};

export default ScholarFaceDeck;
