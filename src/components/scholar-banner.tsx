import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Box } from '@chakra-ui/react';
import ScholarCredit from './scholar-credit';

const CREDIT = 'John Angelo Serrano, 2022 Scholar';

type ScholarBannerData = {
  banner: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
};

/**
 * Full-bleed scholar illustration, half strength, running flush into the
 * footer. The artwork is a wide banner (3.11:1) that would be a sliver on a
 * phone and overbearing on a desktop, so the band is sized in viewport widths
 * and capped, with the image cropped to fill it from the top — the faces sit
 * along the upper edge.
 */
const ScholarBanner: FunctionComponent = () => {
  const data: ScholarBannerData = useStaticQuery(graphql`
    {
      banner: file(relativePath: { eq: "scholar-banner-serrano.jpg" }) {
        childImageSharp {
          gatsbyImageData(quality: 80, layout: FULL_WIDTH)
        }
      }
    }
  `);

  return (
    <Box position="relative" marginTop={[4, 8, 16]}>
      <Box height={['53vw', '40vw', '32vw']} maxHeight="300px" opacity={0.5}>
        <GatsbyImage
          image={data.banner.childImageSharp.gatsbyImageData}
          alt={`Illustration by ${CREDIT}`}
          objectFit="cover"
          objectPosition="center top"
          style={{ height: '100%' }}
        />
      </Box>
      <ScholarCredit credit={CREDIT} />
    </Box>
  );
};

export default ScholarBanner;
