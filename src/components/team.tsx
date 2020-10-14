import React, { FunctionComponent } from 'react';
import { Box, AspectRatioBox, Heading, Text } from '@chakra-ui/core';
import { graphql, StaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import PostBody from './post-body';

const Team: FunctionComponent = () => (
  <StaticQuery
    query={graphql`
      query {
        team: allWpTeamMember {
          nodes {
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
    render={(data) => (
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
          Our Team
        </Heading>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          {data.team.nodes.map((teamMember: any) => (
            <>
              <Box
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
                    <Img
                      fluid={
                        teamMember.featuredImage?.node.localFile.childImageSharp
                          .fluid
                      }
                    />
                  </Box>
                </AspectRatioBox>
                <Text textAlign="center">
                  <Heading
                    as="h3"
                    fontSize="lg"
                    textAlign="center"
                    fontWeight={200}
                    textTransform="uppercase"
                    letterSpacing={4}
                    fontFamily="Trade Gothic, Helvetica"
                    marginBottom={2}
                    minHeight={[null, '3em']}
                  >
                    {teamMember.title}
                  </Heading>
                  <Text color="gray.500" marginBottom="0.5em">
                    {teamMember.customTeamMemberOptions.teammembertitle}
                  </Text>
                </Text>
                <PostBody body={teamMember.content} />
              </Box>
            </>
          ))}
        </Box>
      </>
    )}
  />
);

export default Team;
