import React from "react";
import { Flex, Box, Heading } from "@chakra-ui/core";
import { Helmet } from "react-helmet";
import PostBody from "../components/post-body";
import PrelaunchLayout from "../components/prelaunch-layout";

export default ({ data }) => (
  <PrelaunchLayout title={data.wp.generalSettings.title}>
    <Heading textTransform="uppercase" letterSpacing={4} fontFamily="Trade Gothic, Helvetica">{data.wp.generalSettings.title}</Heading>
    <PostBody body={data.page.content} />
  </PrelaunchLayout>
);

export const query = graphql`
  query homePage {
    wp {
      generalSettings {
        title
      }
    }
    page: wpPage(isFrontPage: { eq: true }) {
      content
    }
  }
`
