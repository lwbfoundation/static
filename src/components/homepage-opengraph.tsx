import React, { FunctionComponent } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

type HomepageOpengraphProps = {
  title: string;
  description: string;
};

const HomepageOpengraph: FunctionComponent<HomepageOpengraphProps> = ({
  title,
  description,
}) => {
  const data = useStaticQuery(graphql`
    {
      file(relativePath: { eq: "share-image.png" }) {
        childImageSharp {
          gatsbyImageData(quality: 90, placeholder: BLURRED, layout: FULL_WIDTH)
        }
      }
    }
  `);

  return (
    <Helmet>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={`${process.env.GATSBY_BASE_URL}${data.file.childImageSharp.gatsbyImageData.images.fallback.src}`}
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </Helmet>
  );
};

export default HomepageOpengraph;
