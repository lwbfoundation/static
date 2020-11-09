import React, { FunctionComponent, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Box, Heading, Text } from '@chakra-ui/core';
import AspectRatioResponsive from './aspect-ratio-responsive';
import BackgroundImage100 from './background-image-100';
import PostBody from './post-body';
import { SubmitButton } from './form';

type ExpandablePostBodyProps = {
  body: string;
};

const ExpandablePostBody: FunctionComponent<ExpandablePostBodyProps> = ({
  body,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // sketchy
  const firstParagraph = body.substr(0, body.indexOf('</p>') + 4);

  return (
    <>
      <PostBody body={isExpanded ? body : firstParagraph} />
      {isExpanded ? null : (
        <Text textAlign="center">
          <SubmitButton
            type="button"
            marginTop={4}
            onClick={() => {
              setIsExpanded(true);
            }}
          >
            Read More
          </SubmitButton>
        </Text>
      )}
    </>
  );
};

const LewisBio: FunctionComponent = () => {
  const data = useStaticQuery(graphql`
    query {
      wpCommonSiteSettings {
        customCommonDataFields {
          lewisbiotitle
          lewisbiobody
          lewisbioimage {
            mobile: localFile {
              childImageSharp {
                fluid(quality: 70, maxWidth: 1280) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
            desktop: localFile {
              childImageSharp {
                fluid(quality: 70) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    }
  `);

  const sources = [
    data.wpCommonSiteSettings.customCommonDataFields.lewisbioimage.mobile
      .childImageSharp.fluid,
    {
      ...data.wpCommonSiteSettings.customCommonDataFields.lewisbioimage.desktop
        .childImageSharp.fluid,
      media: '(min-width: 480px)',
    },
  ];
  return (
    <>
      <Box maxWidth={1024} marginX="auto" marginBottom={16}>
        <AspectRatioResponsive width="100%" ratio={[4 / 3]}>
          <Box>
            <BackgroundImage100 fluid={sources} />
          </Box>
        </AspectRatioResponsive>
      </Box>
      <Box maxWidth={800} marginX="auto" marginBottom={16}>
        <Heading
          textAlign="center"
          as="h2"
          fontWeight={200}
          textTransform="uppercase"
          letterSpacing={4}
          fontFamily="Trade Gothic, Helvetica"
          marginBottom={8}
        >
          {data.wpCommonSiteSettings.customCommonDataFields.lewisbiotitle}
        </Heading>
        <Text as="div" fontSize="1.4em" marginBottom={16}>
          <ExpandablePostBody
            body={data.wpCommonSiteSettings.customCommonDataFields.lewisbiobody}
          />
        </Text>
      </Box>
    </>
  );
};

export default LewisBio;
