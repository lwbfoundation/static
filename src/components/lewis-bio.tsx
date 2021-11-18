import React, { FunctionComponent, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import AspectRatioResponsive from './aspect-ratio-responsive';
import BackgroundImage100 from './background-image-100';
import PostBody from './post-body';

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
          <Button
            as="button"
            // type="button"
            marginTop={8}
            height={7}
            paddingTop={1}
            backgroundColor="blue.brand"
            outline="1px solid white"
            _hover={{
              backgroundColor: 'blue.brand',
            }}
            onClick={() => {
              setIsExpanded(true);
            }}
          >
            Read More
          </Button>
        </Text>
      )}
    </>
  );
};

const LewisBio: FunctionComponent = () => {
  const data = useStaticQuery(graphql`
    {
      wpCommonSiteSettings {
        customCommonDataFields {
          lewisbiotitle
          lewisbiobody
          lewisbioimage {
            mobile: localFile {
              childImageSharp {
                gatsbyImageData(quality: 70, layout: FULL_WIDTH)
              }
            }
            desktop: localFile {
              childImageSharp {
                gatsbyImageData(quality: 70, layout: FULL_WIDTH)
              }
            }
          }
        }
      }
    }
  `);

  const sources = [
    data.wpCommonSiteSettings.customCommonDataFields.lewisbioimage.mobile
      .childImageSharp.gatsbyImageData,
    {
      ...data.wpCommonSiteSettings.customCommonDataFields.lewisbioimage.desktop
        .childImageSharp.gatsbyImageData,
      media: '(min-width: 480px)',
    },
  ];
  return (
    <>
      <Box maxWidth={1024} marginX="auto" marginBottom={[4, 8, 16]}>
        <AspectRatioResponsive width="100%" ratio={[4 / 3]}>
          <Box>
            <BackgroundImage100 image={sources as any} />
          </Box>
        </AspectRatioResponsive>
      </Box>
      <Box maxWidth={800} marginX="auto">
        <Heading textAlign="center" as="h2" marginBottom={8}>
          {data.wpCommonSiteSettings.customCommonDataFields.lewisbiotitle}
        </Heading>
        <Text as="div" fontSize="1.4em" marginBottom={0}>
          <ExpandablePostBody
            body={data.wpCommonSiteSettings.customCommonDataFields.lewisbiobody}
          />
        </Text>
      </Box>
    </>
  );
};

export default LewisBio;
