import React, { FunctionComponent } from 'react';
import { Box, AspectRatio, Heading, Text } from '@chakra-ui/react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import PostBody from './post-body';
import useMatchingHeights from '../utils/use-matching-heights';

type TeamData = Readonly<{
  wpCommonSiteSettings: {
    customCommonDataFields: {
      boardrecruitmenttitle: string;
      boardrecruitmentbody: string;
    };
  };
  team: {
    nodes: {
      id: number;
      title: string;
      content: string;
      customTeamMemberOptions: {
        teammembertitle: string;
      };
      featuredImage: {
        node: {
          localFile: {
            childImageSharp: {
              gatsbyImageData: IGatsbyImageData;
            };
          };
        };
      };
    }[];
  };
}>;

const Team: FunctionComponent = () => {
  const { wpCommonSiteSettings, team }: TeamData = useStaticQuery(graphql`
    {
      wpCommonSiteSettings {
        customCommonDataFields {
          boardrecruitmenttitle
          boardrecruitmentbody
        }
      }
      team: allWpTeamMember {
        nodes {
          id
          title
          content
          customTeamMemberOptions {
            teammembertitle
          }
          featuredImage {
            node {
              localFile {
                childImageSharp {
                  gatsbyImageData(
                    quality: 70
                    width: 480
                    height: 480
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

  const teamMemberNameRefs = useMatchingHeights<HTMLHeadingElement>(
    team.nodes.length
  );
  const teamMemberTitleRefs = useMatchingHeights<HTMLHeadingElement>(
    team.nodes.length
  );

  return (
    <>
      <Heading textAlign="center" as="h2" marginBottom={8}>
        Our Board
      </Heading>
      <Box display="flex" flexWrap="wrap" justifyContent="space-between">
        {team.nodes.map((teamMember, index) => (
          <Box
            key={teamMember.id}
            width={['100%', null, 'calc(33% - 3rem)']}
            maxWidth={80}
            marginBottom={16}
            marginX="auto"
          >
            <AspectRatio ratio={1} marginBottom={4}>
              <Box
                backgroundColor="gray.600"
                width="100%"
                height="100%"
                borderRadius="100%"
                overflow="hidden"
              >
                {teamMember.featuredImage && (
                  <GatsbyImage
                    alt=""
                    image={
                      teamMember.featuredImage.node.localFile.childImageSharp
                        .gatsbyImageData
                    }
                  />
                )}
              </Box>
            </AspectRatio>
            <Text as="div" textAlign="center">
              <Heading
                as="h3"
                variant="h3"
                fontSize="lg"
                textAlign="center"
                marginBottom={2}
                ref={teamMemberNameRefs[index]}
              >
                {teamMember.title}
              </Heading>
              <Text
                color="gray.500"
                marginBottom="0.5em"
                textAlign="center"
                ref={teamMemberTitleRefs[index]}
              >
                {teamMember.customTeamMemberOptions.teammembertitle}
              </Text>
            </Text>
            <Text as="div" textAlign={['left', null, 'justify']}>
              <PostBody body={teamMember.content} />
            </Text>
          </Box>
        ))}
        <Box
          width={[
            '100%',
            null,
            'calc(50% - 3rem)',
            null,
            null,
            null,
            null,
            null,
            'calc(33% - 3rem)',
          ]}
          maxWidth={80}
          marginBottom={16}
          marginX="auto"
          display="flex"
          alignItems="center"
        >
          <Box>
            <Text as="div" textAlign="center">
              <Heading
                as="h3"
                variant="h3"
                fontSize="lg"
                textAlign="center"
                marginBottom={2}
              >
                {
                  wpCommonSiteSettings.customCommonDataFields
                    .boardrecruitmenttitle
                }
              </Heading>
            </Text>
            <Text as="div" textAlign="center">
              <PostBody
                body={
                  wpCommonSiteSettings.customCommonDataFields
                    .boardrecruitmentbody
                }
              />
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Team;
