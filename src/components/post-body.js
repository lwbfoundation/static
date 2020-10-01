import React from "react";
import styled from "@emotion/styled";

const PostBody = ({ body, children }) => <div dangerouslySetInnerHTML={{ __html: body }} />;

export default PostBody;
