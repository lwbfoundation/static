import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { IGatsbyImageData } from 'gatsby-plugin-image';
import { Box, ChakraProps, Divider, Flex, Link } from '@chakra-ui/react';
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

type ScholarData = Readonly<{
  scholars: {
    nodes: {
      id: string;
      title: string;
      content: string;
      date: string;
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

const yearHref = (year: number): string =>
  `/scholarship/recipients/${year}-recipients`;

const YEAR_STYLES: ChakraProps = {
  borderWidth: '2px',
  paddingX: [4, 5],
  paddingY: 2,
  fontSize: ['md', 'lg'],
  lineHeight: 1.2,
  textTransform: 'uppercase',
};

/**
 * Every year of recipients, current one included and marked, so the row reads as
 * "where am I" rather than a list of somewhere else to go.
 */
const YearSwitcher: FunctionComponent<{
  readonly years: number[];
  readonly currentYear: number;
}> = ({ years, currentYear }) => (
  <Box as="nav" aria-label="Scholarship recipients by year">
    <Flex justify="center" wrap="wrap" gridGap={2}>
      {years.map((year) =>
        year === currentYear ? (
          <Box
            key={year}
            {...YEAR_STYLES}
            aria-current="page"
            backgroundColor="blue.brand"
            borderColor="blue.brand"
            color="white"
          >
            {year}
          </Box>
        ) : (
          <Link
            key={year}
            {...YEAR_STYLES}
            href={yearHref(year)}
            borderColor="mint.branddark"
            color="gray.type"
            _hover={{
              backgroundColor: 'mint.brand',
              borderColor: 'mint.brand',
              textDecoration: 'none',
            }}
          >
            {year}
          </Link>
        )
      )}
    </Flex>
  </Box>
);

const Recipients: FunctionComponent<PageTemplateProps> = ({ data }) => {
  const pageDate = new Date(data.page.date);
  const scholarshipYear = pageDate.getFullYear();
  const { scholars }: ScholarData = useStaticQuery(graphql`
    {
      scholars: allWpScholarshipRecipient(limit: 999) {
        nodes {
          id
          title
          content
          date
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

  const years = [
    ...new Set([
      scholarshipYear,
      ...scholars.nodes.map((scholar) => new Date(scholar.date).getFullYear()),
    ]),
  ].sort((a, b) => b - a);

  const filteredScholars = scholars.nodes.filter((scholar) => {
    const scholarDate = new Date(scholar.date);
    const scholarYear = scholarDate.getFullYear();
    return scholarYear === scholarshipYear;
  });

  const sortedScholars = filteredScholars.sort((a, b) => {
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
        {scholar.scholarshipRecipientDetails.school
          ? `${scholar.scholarshipRecipientDetails.school}, `
          : 'Class of '}
        {scholar.scholarshipRecipientDetails.graduationyear}
      </>
    ),
    description: scholar.content,
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
      <PageContainer marginBottom={[10, null, 16]}>
        <YearSwitcher years={years} currentYear={scholarshipYear} />
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

export default Recipients;
