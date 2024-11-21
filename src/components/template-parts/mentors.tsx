import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { IGatsbyImageData } from 'gatsby-plugin-image';
import { Divider } from '@chakra-ui/react';
import { PageTemplateProps } from '../../templates/single/Page';
import { PageContainer } from '../styleguide/page-container';
import PageWrapper from './page-wrapper';
import Footer from './footer';
import PeopleList from '../peoplelist';
import CustomHeading from '../custom-heading';

const compareStrings = (a: string, b: string): number => {
  if (a < b) return -1;
  if (a > b) return 1;

  return 0;
};

type MentorData = Readonly<{
  mentors: {
    nodes: {
      id: string;
      title: string;
      content: string;
      date: string;
      mentorDetails: {
        areaofexpertise: string;
        organization: string;
        organizationurl: string;
      };
      featuredImage: {
        node: {
          localFile: {
            childImageSharp: {
              gatsbyImageData: IGatsbyImageData;
            };
          };
        };
      } | null;
    }[];
  };
}>;

const Mentors: FunctionComponent<PageTemplateProps> = ({ data }) => {
  const {
    mentors: { nodes: mentors },
  }: MentorData = useStaticQuery(graphql`
    {
      mentors: allWpMentor(limit: 999) {
        nodes {
          id
          title
          content
          date
          mentorDetails {
            areaofexpertise
            organization
            organizationurl
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

  const sortedMentors = mentors.sort((a, b) => {
    const splitA = a.title.split(' ');
    const splitB = b.title.split(' ');
    const lastA = splitA[splitA.length - 1];
    const lastB = splitB[splitB.length - 1];
    return lastA === lastB
      ? compareStrings(splitA[0], splitB[0])
      : compareStrings(lastA, lastB);
  });

  const people = sortedMentors.map((mentor) => ({
    id: mentor.id,
    imageData:
      mentor.featuredImage &&
      mentor.featuredImage.node.localFile.childImageSharp.gatsbyImageData,
    heading: mentor.title,
    subheading: (
      <>
        {mentor.mentorDetails.areaofexpertise}
        {mentor.mentorDetails.organization && (
          <>
            <br />
            <a
              href={mentor.mentorDetails.organizationurl}
              target="_blank"
              rel="noreferrer"
            >
              {mentor.mentorDetails.organization}
            </a>
          </>
        )}
      </>
    ),
    description: mentor.content,
  }));

  return (
    <PageWrapper data={data}>
      <PageContainer maxWidth={600}>
        <CustomHeading
          as="h1"
          marginY={16}
          textAlign="center"
          body={data.page.title}
        />
      </PageContainer>
      <PageContainer>
        <Divider
          borderColor="mint.brand"
          marginBottom={16}
          display={['none', null, 'block']}
        />
      </PageContainer>
      <PageContainer>
        <PeopleList people={people} />
      </PageContainer>
      <Footer data={data} />
    </PageWrapper>
  );
};

export default Mentors;
