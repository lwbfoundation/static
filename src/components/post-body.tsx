import React, { FunctionComponent } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import styled from '@emotion/styled';
import theme from '../@chakra-ui/gatsby-plugin/theme';

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
  a {
    color: ${theme.colors.orange.brand};
  }
  ul,
  ol {
    margin-bottom: 2rem;
    margin-left: 1rem;
  }
`;

const PostBody: FunctionComponent<PostBodyProps> = ({ body, ...rest }) => (
  // eslint-disable-next-line react/no-danger
  <PostBodyInner dangerouslySetInnerHTML={{ __html: body }} {...rest} />
);

export default PostBody;
