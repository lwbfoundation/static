import { Heading } from '@chakra-ui/react';
import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { PageTemplateProps } from '../../templates/single/Page';
import { PageContainer } from '../styleguide/page-container';
import PageWrapper from './page-wrapper';
import Footer from './footer';
import { IGatsbyImageData } from 'gatsby-plugin-image';
import PeopleList from '../peoplelist';

const compareStrings = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;

  return 0;
};

type ScholarData = Readonly<{
  scholars: {
    nodes: {
      id: string;
      title: string;
      scholarshipRecipientDetails: {
        school: string;
        graduationyear: string;
        major: string;
        isanonymous: boolean;
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

const Recipients: FunctionComponent<PageTemplateProps> = ({ data }) => {
  const { scholars }: ScholarData = useStaticQuery(graphql`
    {
      scholars: allWpScholarshipRecipient(
        filter: { date: { gt: "2022-01-01", lt: "2023-01-01" } }
      ) {
        nodes {
          id
          title
          scholarshipRecipientDetails {
            school
            graduationyear
            major
            isanonymous
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

  const sortedScholars = scholars.nodes.sort((a, b) => {
    if (
      !a.scholarshipRecipientDetails.isanonymous &&
      b.scholarshipRecipientDetails.isanonymous
    ) {
      return -1;
    }
    if (
      a.scholarshipRecipientDetails.isanonymous &&
      !b.scholarshipRecipientDetails.isanonymous
    ) {
      return 1;
    }
    const splitA = a.title.split(' ');
    const splitB = b.title.split(' ');
    const lastA = splitA[splitA.length - 1];
    const lastB = splitB[splitB.length - 1];
    return lastA === lastB
      ? compareStrings(splitA[0], splitB[0])
      : compareStrings(lastA, lastB);
  });

  const people = sortedScholars.map((scholar) => ({
    id: scholar.id,
    imageData:
      scholar.featuredImage &&
      scholar.featuredImage.node.localFile.childImageSharp.gatsbyImageData,
    heading: scholar.title,
    subheading: (
      <>
        {scholar.scholarshipRecipientDetails.major}
        <br />
        {scholar.scholarshipRecipientDetails.school},{' '}
        {scholar.scholarshipRecipientDetails.graduationyear}
      </>
    ),
    description: null,
  }));

  return (
    <PageWrapper data={data}>
      <PageContainer maxWidth={600}>
        <Heading marginY={16} as="h1" color="orange.brand" textAlign="center">
          {data.page.title}
        </Heading>
      </PageContainer>
      <PageContainer>
        <PeopleList people={people} />
      </PageContainer>
      <Footer data={data} />
    </PageWrapper>
  );
};

export default Recipients;
