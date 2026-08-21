import React, { FunctionComponent } from 'react';
import { graphql, Link } from 'gatsby';
import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import striptags from 'striptags';
import { PageTemplateProps } from './Page';
import { PageContainer } from '../../components/styleguide/page-container';
import PageWrapper from '../../components/template-parts/page-wrapper';
import Footer from '../../components/template-parts/footer';
import ArticleOpengraph from '../../components/article-opengraph';
import CustomHeading from '../../components/custom-heading';
import PostBody from '../../components/post-body';
import { NEWS_ROOT, newsPostPath } from '../../utils/news-paths';

interface AdjacentPost {
  readonly title: string;
  readonly slug: string;
}

interface PostTemplateProps {
  readonly data: {
    readonly post: {
      readonly title: string;
      readonly content: string;
      readonly excerpt: string | null;
      readonly slug: string;
      readonly displayDate: string;
      readonly publishedTime: string;
      readonly featuredImage: {
        node: {
          localFile: {
            childImageSharp: {
              gatsbyImageData: IGatsbyImageData;
            } | null;
            openGraph: {
              gatsbyImageData: IGatsbyImageData;
            } | null;
          } | null;
        };
      } | null;
    };
    readonly wpCommonSiteSettings: PageTemplateProps['data']['wpCommonSiteSettings'];
    readonly olderPost: AdjacentPost | null;
    readonly newerPost: AdjacentPost | null;
  };
}

const DESCRIPTION_LENGTH = 200;

/** Share blurb from the manual excerpt where there is one, the body otherwise. */
function toDescription(html: string): string {
  const text = striptags(html).replace(/\s+/g, ' ').trim();

  return text.length > DESCRIPTION_LENGTH
    ? `${text.slice(0, DESCRIPTION_LENGTH - 1).trimEnd()}…`
    : text;
}

const Post: FunctionComponent<PostTemplateProps> = ({ data }) => {
  const { post, olderPost, newerPost } = data;
  const localFile = post.featuredImage?.node?.localFile;
  const image = localFile?.childImageSharp?.gatsbyImageData;
  const shareImage = localFile?.openGraph?.gatsbyImageData;

  // As in news-year.tsx: PageWrapper and Footer are typed against the page
  // query but only read wpCommonSiteSettings.
  const wrapperData = {
    ...data,
    page: { title: post.title },
  } as unknown as PageTemplateProps['data'];

  return (
    <PageWrapper data={wrapperData} title={post.title}>
      <ArticleOpengraph
        title={post.title}
        description={toDescription(post.excerpt || post.content)}
        path={newsPostPath(post.slug)}
        publishedTime={post.publishedTime}
        imageSrc={shareImage?.images?.fallback?.src}
      />
      <PageContainer maxWidth={800}>
        <Box marginTop={12} marginBottom={8} fontSize="sm" fontWeight={600}>
          <Link to={NEWS_ROOT}>&larr; All news</Link>
        </Box>
        <Text
          fontSize="sm"
          textTransform="uppercase"
          color="gray.icon"
          marginBottom={2}
        >
          {post.displayDate}
        </Text>
        <CustomHeading as="h1" marginBottom={10} body={post.title} />
        {!!image && (
          <Box marginBottom={10}>
            <GatsbyImage image={image} alt="" />
          </Box>
        )}
        <PostBody body={post.content} richText />
        {(!!olderPost || !!newerPost) && (
          <>
            <Divider borderColor="mint.brand" marginY={12} />
            <Flex
              justifyContent="space-between"
              flexWrap="wrap"
              fontSize="sm"
              fontWeight={600}
            >
              <Box marginRight={4}>
                {!!newerPost && (
                  <Link to={newsPostPath(newerPost.slug)}>
                    &larr; {newerPost.title}
                  </Link>
                )}
              </Box>
              <Box textAlign="right">
                {!!olderPost && (
                  <Link to={newsPostPath(olderPost.slug)}>
                    {olderPost.title} &rarr;
                  </Link>
                )}
              </Box>
            </Flex>
          </>
        )}
      </PageContainer>
      <Footer data={wrapperData} />
    </PageWrapper>
  );
};

export default Post;

export const query = graphql`
  query post($id: String!, $olderPost: String, $newerPost: String) {
    post: wpPost(id: { eq: $id }) {
      title
      content
      excerpt
      slug
      displayDate: date(formatString: "MMMM D, YYYY")
      publishedTime: dateGmt(formatString: "YYYY-MM-DDTHH:mm:ss[Z]")
      featuredImage {
        node {
          localFile {
            childImageSharp {
              gatsbyImageData(
                quality: 80
                width: 900
                layout: CONSTRAINED
                placeholder: TRACED_SVG
              )
            }
            openGraph: childImageSharp {
              gatsbyImageData(width: 1200, height: 630, layout: FIXED)
            }
          }
        }
      }
    }

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

    olderPost: wpPost(id: { eq: $olderPost }) {
      title
      slug
    }

    newerPost: wpPost(id: { eq: $newerPost }) {
      title
      slug
    }
  }
`;
