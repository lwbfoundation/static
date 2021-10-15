import React, { FunctionComponent } from 'react';
import { Global, css } from '@emotion/react';
import { Helmet } from 'react-helmet';
import theme from '../@chakra-ui/gatsby-plugin/theme';

interface HeadContentProps {
  title: string;
}

const HeadContent: FunctionComponent<HeadContentProps> = ({ title }) => (
  <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Global
      styles={css`
        @font-face {
          font-family: 'Trade Gothic';
          src: url('/fonts/Edmondsans-Bold.otf');
          font-weight: 600;
          font-display: fallback;
        }

        @font-face {
          font-family: 'Trade Gothic';
          src: url('/fonts/Edmondsans-Medium.otf');
          font-weight: 400;
          font-display: fallback;
        }

        @font-face {
          font-family: 'Trade Gothic';
          src: url('/fonts/Edmondsans-Regular.otf');
          font-weight: 200;
          font-display: fallback;
        }

        a {
          text-decoration: underline;
        }

        body {
          color: ${theme.colors.gray.type};
          font-family: 'Trade Gothic';
        }
      `}
    />
  </>
);

export default HeadContent;
