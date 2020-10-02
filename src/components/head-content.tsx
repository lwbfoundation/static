import React, { FunctionComponent } from 'react';
import { Global, css } from '@emotion/core';
import { Helmet } from 'react-helmet';

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
      `}
    />
  </>
);

export default HeadContent;
