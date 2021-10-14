import React, { FunctionComponent } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import styled from '@emotion/styled';

type PostBodyProps = BoxProps & {
  body: string;
};

const PostBodyInner = styled(Box)`
  p:not(:last-child) {
    margin-bottom: 2rem;
  }
  img:not(:last-child) {
    margin-bottom: 2rem;
  }
`;

const PostBody: FunctionComponent<PostBodyProps> = ({ body, ...rest }) => (
  // eslint-disable-next-line react/no-danger
  <PostBodyInner dangerouslySetInnerHTML={{ __html: body }} {...rest} />
);

export default PostBody;
