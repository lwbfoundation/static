import React from "react";
import { Heading, Button } from "@chakra-ui/core";
import PostBody from "../post-body";
import HeadContent from "../head-content";

const Homepage = ({ data }) => (
  <>
    <HeadContent title={data.wp.generalSettings.title} />
    <Heading as="h1" fontWeight={200} textTransform="uppercase" letterSpacing={4} fontFamily="Trade Gothic, Helvetica">{data.wp.generalSettings.title}</Heading>
    <PostBody body={data.page.customHomepageOptions.subheading} />
    <PostBody body={data.page.content} />
    <p><Button as="a" href="https://checkout.square.site/pay/00a267318b4a4218a46547abbd5de660">{data.page.customHomepageOptions.donatebuttontext}</Button></p>
    <PostBody body={data.page.customHomepageOptions.legalinfo} />
  </>
)

export default Homepage;
