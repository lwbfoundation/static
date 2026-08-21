import React, { FunctionComponent } from 'react';
import { graphql, Link } from 'gatsby';
import { Box, Divider, Text } from '@chakra-ui/react';
import { PageTemplateProps } from './single/Page';
import { PageContainer } from '../components/styleguide/page-container';
import PageWrapper from '../components/template-parts/page-wrapper';
import Footer from '../components/template-parts/footer';
import CustomHeading from '../components/custom-heading';
import NewsArticles from '../components/news-articles';
import NewsYearLinks from '../components/news-year-links';
import { NEWS_ROOT } from '../utils/news-paths';
import { groupPostsByYear, useNewsPosts } from '../utils/use-news-posts';

interface NewsYearTemplateProps {
  readonly data: {
    readonly wpCommonSiteSettings: PageTemplateProps['data']['wpCommonSiteSettings'];
  };
  readonly pageContext: {
    readonly year: string;
  };
}

const NewsYear: FunctionComponent<NewsYearTemplateProps> = ({
  data,
  pageContext: { year },
}) => {
  const allPosts = useNewsPosts();
  const years = groupPostsByYear(allPosts);
  const posts = allPosts.filter((post) => post.year === year);
  const title = `News from ${year}`;

  // PageWrapper and Footer only ever read `wpCommonSiteSettings`, but they're
  // typed against the full page query, so stand in a page with just the title.
  const wrapperData = {
    ...data,
    page: { title },
  } as unknown as PageTemplateProps['data'];

  return (
    <PageWrapper data={wrapperData} title={title}>
      <PageContainer maxWidth={800}>
        <Box marginTop={12} fontSize="sm" fontWeight={600}>
          <Link to={NEWS_ROOT}>&larr; Latest news</Link>
        </Box>
        <CustomHeading as="h1" marginY={12} body={title} />
        {posts.length === 0 ? (
          <Text>Nothing was published in {year}.</Text>
        ) : (
          <NewsArticles posts={posts} />
        )}
        <Divider borderColor="mint.brand" marginY={16} />
        <NewsYearLinks
          years={years.map((group) => group.year)}
          currentYear={year}
          label="Other years"
          includeLatestLink
        />
      </PageContainer>
      <Footer data={wrapperData} />
    </PageWrapper>
  );
};

export default NewsYear;

export const query = graphql`
  query newsYear {
    wpCommonSiteSettings {
      title
      customCommonDataFields {
        subheading
        newslettersignupbuttontext
        legalinfo
        address
        contactemail
        donatebuttontext
      }
    }
  }
`;
