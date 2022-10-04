import React, { FunctionComponent } from 'react';
import { Heading, Text } from '@chakra-ui/react';
import { graphql, useStaticQuery } from 'gatsby';
import { IGatsbyImageData } from 'gatsby-plugin-image';
import PostBody from './post-body';
import PeopleList from './peoplelist';

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

  const people = team.nodes.map((teamMember) => ({
    id: teamMember.id,
    imageData:
      teamMember.featuredImage &&
      teamMember.featuredImage.node.localFile.childImageSharp.gatsbyImageData,
    heading: teamMember.title,
    subheading: teamMember.customTeamMemberOptions.teammembertitle,
    description: teamMember.content,
  }));

  return (
    <>
      <Heading textAlign="center" as="h2" marginBottom={8}>
        Our Board
      </Heading>
      <PeopleList
        people={people}
        lastItem={
          <>
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
          </>
        }
      />
    </>
  );
};

export default Team;
