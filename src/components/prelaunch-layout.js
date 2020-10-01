import React from "react";
import { Flex, Box, Heading } from "@chakra-ui/core";
import { Global, css } from "@emotion/core";
import { Helmet } from "react-helmet";
import PostBody from "../components/post-body";

const PrelaunchLayout = ({ title, children }) => <>
  <Helmet>
    <title>{title}</title>
  </Helmet>
  <Global styles={css`
    @font-face {
      font-family: "Trade Gothic";
      src: url("/fonts/TradeGothicLTStd-Bd2.otf");
      font-display: fallback;
    }

    html {
      height: 100%;
      background-color: #4b4b4b;
    }
    
    body {
      height: 100%;
      color: #ffffff;
    }
    
    #___gatsby, #gatsby-focus-wrapper {
      height: 100%;
    }
    
    a {
      text-decoration: underline;
    }
  `} />
  <Flex align="center" justify="center" width="100%" height="100%">
    <Box textAlign="center" marginBottom="8%">
      {children}
    </Box>
  </Flex>
</>;

export default PrelaunchLayout;
