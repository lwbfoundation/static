import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';

interface PostBodyProps {
  body: string;
}

const PostBodyInner = styled.div`
  p:not(:last-child) {
    margin-bottom: 2rem;
  }
`;

const PostBody: FunctionComponent<PostBodyProps> = ({ body }) => (
  // eslint-disable-next-line react/no-danger
  <PostBodyInner dangerouslySetInnerHTML={{ __html: body }} />
);

export default PostBody;
