import React, { FunctionComponent } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

type ArticleOpengraphProps = {
  title: string;
  description: string;
  /** Site-relative path of the article, e.g. `/news/a-post/`. */
  path: string;
  /** ISO 8601 UTC, e.g. `2026-08-21T01:20:53Z`. */
  publishedTime: string;
  /**
   * Site-relative src of a 1200x630 crop of the article's featured image.
   * Articles without one fall back to the site's share image.
   */
  imageSrc?: string | null;
};

const ArticleOpengraph: FunctionComponent<ArticleOpengraphProps> = ({
  title,
  description,
  path,
  publishedTime,
  imageSrc,
}) => {
  const data = useStaticQuery(graphql`
    query ArticleShareImage {
      file(relativePath: { eq: "share-image.png" }) {
        childImageSharp {
          gatsbyImageData(quality: 90, placeholder: BLURRED, layout: FULL_WIDTH)
        }
      }
    }
  `);

  const baseUrl = process.env.GATSBY_BASE_URL || '';
  const image =
    imageSrc || data.file.childImageSharp.gatsbyImageData.images.fallback.src;
  const imageUrl = `${baseUrl}${image}`;

  return (
    <Helmet>
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${baseUrl}${path}`} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="article:published_time" content={publishedTime} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default ArticleOpengraph;
