import React from "react";
import { Heading } from "@chakra-ui/core";
import PostBody from "../post-body";
import PrelaunchLayout from "../prelaunch-layout";

const Placeholder = ({ data }) => (
  <PrelaunchLayout title={data.wp.generalSettings.title}>
    <Heading as="h1" textAlign="center" textTransform="uppercase" letterSpacing={4} fontFamily="Trade Gothic, Helvetica">{data.wp.generalSettings.title}</Heading>
    <PostBody body={data.page.content} />
  </PrelaunchLayout>
);

export default Placeholder;
