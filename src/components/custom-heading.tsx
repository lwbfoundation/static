import React, { ComponentProps, FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { Heading } from '@chakra-ui/react';
import PostBody from './post-body';

const CustomUnderlineStyles = styled.div`
  text-decoration-skip-ink: none;
  -webkit-text-decoration-skip: none;
`;

const CustomHeading: FunctionComponent<ComponentProps<typeof PostBody>> = (
  props
) => {
  return (
    <CustomUnderlineStyles>
      <PostBody
        as={Heading}
        color="orange.brand"
        fontSize={['4xl', null, '4xl', '5xl', '6xl']}
        lineHeight={1.25}
        textDecoration="underline"
        textUnderlineOffset="0.15em"
        // textDecoration={['none', null, 'underline']}
        {...props}
      />
    </CustomUnderlineStyles>
  );
};

export default CustomHeading;
