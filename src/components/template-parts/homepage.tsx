import React, { FunctionComponent } from 'react';
import { Heading, Button, Link } from '@chakra-ui/core';
import { ButtonProps } from '@chakra-ui/core/dist/Button';
import { LinkProps } from '@chakra-ui/core/dist/Link';
import PostBody from '../post-body';
import HeadContent from '../head-content';
import Donate from '../donate';
import { PageTemplateProps } from '../../templates/single/Page';

type ButtonLinkProps = ButtonProps & LinkProps;

const ButtonLink: React.FC<ButtonLinkProps> = React.forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: ButtonLinkProps, ref: React.Ref<any>) => {
    return <Button ref={ref} as={Link} {...props} />;
  }
);

const Homepage: FunctionComponent<PageTemplateProps> = ({ data }) => (
  <>
    <HeadContent title={data.wp.generalSettings.title} />
    <Heading
      as="h1"
      fontWeight={200}
      textTransform="uppercase"
      letterSpacing={4}
      fontFamily="Trade Gothic, Helvetica"
    >
      {data.wp.generalSettings.title}
    </Heading>
    <PostBody body={data.page.customHomepageOptions.subheading} />
    <PostBody body={data.page.content} />
    <Donate
      donateButtonText={data.page.customHomepageOptions.donatebuttontext}
    />
    {/* <p>
      <ButtonLink
        as="a"
        href="https://checkout.square.site/pay/00a267318b4a4218a46547abbd5de660"
      >
        {data.page.customHomepageOptions.donatebuttontext}
      </ButtonLink>
    </p> */}
    <PostBody body={data.page.customHomepageOptions.legalinfo} />
  </>
);

export default Homepage;
