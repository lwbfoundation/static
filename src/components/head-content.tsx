import React, { FunctionComponent } from 'react';
import { Global, css } from '@emotion/react';
import { Helmet } from 'react-helmet';
import theme from '../@chakra-ui/gatsby-plugin/theme';
import favicon from '../assets/images/favicon.png';

interface HeadContentProps {
  title: string;
}

const HeadContent: FunctionComponent<HeadContentProps> = ({ title }) => (
  <>
    <Helmet>
      <title>{title}</title>
      <link rel="icon" href={favicon} />
      <meta name="x-built-at" content={new Date().toISOString()} />
    </Helmet>
    {/* Font faces live in `gatsby-ssr.js`, in the document head, so they are
        not re-created on every route change. */}
    <Global
      styles={css`
        a {
          text-decoration: underline;
        }

        body {
          color: ${theme.colors.gray.type};
          font-family: 'Edmond Sans';
        }
      `}
    />
  </>
);

export default HeadContent;
