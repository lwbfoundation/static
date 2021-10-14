import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import { Box, Heading } from '@chakra-ui/react';
import { GatsbyImage } from 'gatsby-plugin-image';
import Layout from '../default-layout';
import { normalizePath } from '../../utils/get-url-path';
import { PageTemplateProps } from '../../templates/single/Page';

const BlogPost: FunctionComponent<PageTemplateProps> = ({ data }) => {
  const { nextPage, previousPage, page } = data;
  const { title, content, featuredImage } = page;

  return (
    <Layout>
      <Heading as="h1" size="xl" mb={5}>
        {title}
      </Heading>

      {!!featuredImage?.node?.remoteFile?.childImageSharp && (
        <Box mb={5}>
          <GatsbyImage
            alt=""
            image={
              featuredImage.node.remoteFile.childImageSharp.gatsbyImageData
            }
          />
        </Box>
      )}

      {/* eslint-disable-next-line react/no-danger */}
      <p dangerouslySetInnerHTML={{ __html: content }} />

      <br />
      {!!nextPage && (
        <Link to={normalizePath(nextPage.uri)}>
          Next:
          {nextPage.title}
        </Link>
      )}
      <br />
      {!!previousPage && (
        <Link to={normalizePath(previousPage.uri)}>
          Previous: {previousPage.title}
        </Link>
      )}
    </Layout>
  );
};

export default BlogPost;
