import React, { FunctionComponent, Fragment } from 'react';
import { Box, AspectRatioBox, Heading, Text } from '@chakra-ui/core';
import { graphql, StaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import PostBody from './post-body';
import useFixedHeights from '../utils/use-fixed-heights';

type TeamProps = Readonly<{
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
              fluid: any;
            };
          };
        };
      };
    }[];
  };
}>;

const TeamInner: FunctionComponent<TeamProps> = ({ team }) => {
  const teamMemberNameRefs = useFixedHeights(team.nodes.length);
  const teamMemberTitleRefs = useFixedHeights(team.nodes.length);

  return (
    <>
      <Heading
        textAlign="center"
        as="h2"
        fontWeight={200}
        textTransform="uppercase"
        letterSpacing={4}
        fontFamily="Trade Gothic, Helvetica"
        marginBottom={8}
      >
        Our Board
      </Heading>
      <Box display="flex" flexWrap="wrap" justifyContent="space-between">
        {team.nodes.map((teamMember, index) => (
          <Box
            key={teamMember.id}
            width={['100%', 'calc(50% - 2rem)', 'calc(33% - 2rem)']}
            marginBottom={16}
            marginX="auto"
          >
            <AspectRatioBox ratio={1} marginBottom={4}>
              <Box
                backgroundColor="gray.600"
                width="100%"
                height="100%"
                borderRadius="100%"
                overflow="hidden"
              >
                {teamMember.featuredImage && (
                  <Img
                    fluid={
                      teamMember.featuredImage.node.localFile.childImageSharp
                        .fluid
                    }
                  />
                )}
              </Box>
            </AspectRatioBox>
            <Text as="div" textAlign="center">
              <Heading
                as="h3"
                fontSize="lg"
                textAlign="center"
                fontWeight={200}
                textTransform="uppercase"
                letterSpacing={4}
                fontFamily="Trade Gothic, Helvetica"
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
            <PostBody body={teamMember.content} />
          </Box>
        ))}
      </Box>
    </>
  );
};

const Team: FunctionComponent = () => (
  <StaticQuery
    query={graphql`
      query {
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
                    fluid(quality: 90, maxWidth: 480, maxHeight: 480) {
                      ...GatsbyImageSharpFluid_withWebp
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={TeamInner}
  />
);

export default Team;
