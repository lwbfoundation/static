import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import { Box, Divider, Heading, Stack } from '@chakra-ui/react';
import { GatsbyImage } from 'gatsby-plugin-image';
import PostBody from './post-body';
import { newsPostPath } from '../utils/news-paths';
import { NewsPost } from '../utils/use-news-posts';

/**
 * Articles are shown in full rather than summarized, so the title still links
 * to the post's own page — that's the URL to share, and where the OpenGraph
 * tags live.
 */
const NewsArticle: FunctionComponent<{ post: NewsPost }> = ({ post }) => {
  const path = newsPostPath(post.slug);
  const image =
    post.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData;

  return (
    <Box as="article">
      <Heading
        as="h2"
        fontSize={['2xl', null, '3xl']}
        color="blue.brand"
        textDecoration="none"
        marginBottom={6}
      >
        <Link to={path}>{post.title}</Link>
      </Heading>
      {!!image && (
        <Box marginBottom={6}>
          <GatsbyImage image={image} alt="" />
        </Box>
      )}
      <PostBody body={post.content} richText />
    </Box>
  );
};

const NewsArticles: FunctionComponent<{ posts: NewsPost[] }> = ({ posts }) => (
  <Stack
    spacing={[12, null, 16]}
    divider={<Divider borderColor="mint.brand" />}
  >
    {posts.map((post) => (
      <NewsArticle key={post.id} post={post} />
    ))}
  </Stack>
);

export default NewsArticles;
