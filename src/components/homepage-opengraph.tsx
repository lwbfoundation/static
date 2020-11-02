import React, { FunctionComponent } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

type HomepageOpengraphProps = {
  title: string;
  description: string;
};

const HomepageOpengraph: FunctionComponent<HomepageOpengraphProps> = ({
  title,
  description,
}) => {
  return (
    <StaticQuery
      query={graphql`
        query {
          file(relativePath: { eq: "javier-trueba-iQPr1XkF5F0-unsplash.jpg" }) {
            childImageSharp {
              fluid(quality: 90, maxWidth: 1200, maxHeight: 630) {
                src
              }
            }
          }
        }
      `}
      render={(data) => {
        return (
          <Helmet>
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta
              property="og:image:secure_url"
              content={data.file.childImageSharp.fluid.src}
            />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
          </Helmet>
        );
      }}
    />
  );
};

export default HomepageOpengraph;
