import React, { FunctionComponent } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import theme from '../@chakra-ui/gatsby-plugin/theme';
import { LEAD_SENTENCE_CLASS } from '../utils/lead-sentence';

type PostBodyProps = BoxProps & {
  body: string;
  /**
   * Styles the richer markup WordPress emits in article bodies — headings,
   * captions, quotes, tables and the align* classes. Off by default so the
   * short snippets this also renders (the footer, page subheadings) keep the
   * spacing they were designed against.
   */
  richText?: boolean;
  /**
   * Styles the span that `utils/lead-sentence` wraps around the opening
   * sentence of the first paragraph. Opt-in, and deliberately not combinable
   * with `richText`: the bodies that want a lead sentence are short intros,
   * not articles.
   */
  leadSentence?: boolean;
};

const baseStyles = css`
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

/**
 * Nothing loads WordPress's own stylesheet on a headless site, and Chakra's
 * reset flattens headings to body text and zeroes every margin — so editor
 * markup arrives here with no styling of its own at all.
 */
const richTextStyles = css`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    line-height: 1.25;
    margin-bottom: 1rem;
  }
  h1,
  h2 {
    font-size: 1.75rem;
  }
  h3 {
    font-size: 1.375rem;
  }
  h4,
  h5,
  h6 {
    font-size: 1.125rem;
  }
  * + h1,
  * + h2,
  * + h3,
  * + h4,
  * + h5,
  * + h6 {
    margin-top: 2.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  blockquote {
    margin: 2rem 0;
    padding-left: 1.5rem;
    border-left: 4px solid ${theme.colors.mint.brand};
    font-style: italic;
  }

  hr {
    margin: 2.5rem 0;
    border-top: 1px solid ${theme.colors.mint.brand};
  }

  table {
    width: 100%;
    margin-bottom: 2rem;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid ${theme.colors.mint.brand};
  }
  th {
    font-weight: 600;
  }

  pre {
    margin-bottom: 2rem;
    overflow-x: auto;
  }

  figure {
    margin-bottom: 2rem;
  }
  figcaption,
  .wp-caption-text {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: ${theme.colors.gray.icon};
  }
  .wp-caption {
    max-width: 100%;
    margin-bottom: 2rem;
  }

  /* Images the source plugin couldn't localize stay as a plain <img>. The ones
     it did are wrapped, and the wrapper is what needs constraining — its inner
     <img> is positioned by gatsby-plugin-image and must be left alone. */
  p > img,
  li > img,
  figure > img {
    max-width: 100%;
    height: auto;
  }
  .gatsby-image-wrapper {
    max-width: 100%;
  }

  iframe,
  video,
  embed,
  object {
    max-width: 100%;
  }

  /* The source plugin swaps an inline <img> for its own markup but carries the
     editor's alignment classes over to the wrapper, so they're here to honour. */
  .aligncenter {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .alignleft {
    float: left;
    margin: 0 1.5rem 1rem 0;
  }
  .alignright {
    float: right;
    margin: 0 0 1rem 1.5rem;
  }

  /* Keep a float from escaping the article. */
  &::after {
    content: '';
    display: table;
    clear: both;
  }
`;

/**
 * The opening sentence promoted to a statement above the paragraph it starts.
 * It has to be a block: left inline, a run this much larger than its paragraph
 * drags that one line's leading open and the rest of the block goes ragged.
 */
const leadSentenceStyles = css`
  .${LEAD_SENTENCE_CLASS} {
    display: block;
    margin-bottom: 1.5rem;
    color: ${theme.colors.blue.brand};
    /* Holds the size this was designed at. It was drawn as 1.85em over an 18px
       body; the body is now set at 1.4em to match the Lewis bio, so the same
       result needs 1.5 rather than 1.85. */
    font-size: 1.5em;
    /* 600 is the Bold face. gatsby-ssr.js declares no 700, so asking for one
       only resolves back here by nearest-weight matching. */
    font-weight: 600;
    line-height: 1.28;
  }
  p:nth-of-type(n + 2) {
    color: ${theme.colors.gray.type};
  }
`;

const PostBodyInner = styled(Box)`
  ${baseStyles}
`;

const LeadSentenceBody = styled(Box)`
  ${baseStyles}
  ${leadSentenceStyles}
`;

const RichTextBody = styled(Box)`
  ${baseStyles}
  ${richTextStyles}
`;

const PostBody: FunctionComponent<PostBodyProps> = ({
  body,
  richText = false,
  leadSentence = false,
  ...rest
}) => {
  const Component = (() => {
    if (richText) return RichTextBody;
    if (leadSentence) return LeadSentenceBody;
    return PostBodyInner;
  })();

  return (
    // eslint-disable-next-line react/no-danger
    <Component dangerouslySetInnerHTML={{ __html: body }} {...rest} />
  );
};

export default PostBody;
