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
          src: url('/fonts/TradeGothicLTStd-Bd2.otf');
          font-display: fallback;
        }

        a {
          text-decoration: underline;
        }

        body {
          color: ${theme.colors.gray.type};
        }
      `}
    />
  </>
);

export default HeadContent;
