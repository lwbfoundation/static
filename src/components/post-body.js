import React from 'react';

const PostBody = ({ body }) => (
  <div dangerouslySetInnerHTML={{ __html: body }} />
);

export default PostBody;
