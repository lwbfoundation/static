import React, { FunctionComponent } from 'react';

interface PostBodyProps {
  body: string;
}

const PostBody: FunctionComponent<PostBodyProps> = ({ body }) => (
  // eslint-disable-next-line react/no-danger
  <div dangerouslySetInnerHTML={{ __html: body }} />
);

export default PostBody;
