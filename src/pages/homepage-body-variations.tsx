/**
 * SCRATCH PAGE — /homepage-body-variations/
 *
 * Five ways to emphasise the opening *sentence* of the homepage body — the two
 * paragraphs WordPress holds as the homepage page's own `content`, rendered
 * today by `template-parts/homepage.tsx` as:
 *
 *   <PageContainer>
 *     <PostBody body={data.page.content} fontSize="lg"
 *               textAlign={['left', null, 'center']} marginTop={[4, 8, 16]} />
 *   </PageContainer>
 *
 * The sentence is found and wrapped by `utils/lead-sentence`, which is a pure
 * string transform over the WordPress markup — the copy never leaves WP, and
 * nothing here reads what it says. See that file for why the split needs an
 * abbreviation guard rather than `Intl.Segmenter`.
 *
 * Nothing imports this file; delete it once a direction is picked.
 *
 * Panel 0 is today's block, untouched, at its real full-container width. The
 * five treatments are all held at the same 820px measure and the same centred
 * setting, so what differs between them is only the sentence treatment.
 */
import React, { FunctionComponent, ReactNode } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Box, Heading, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { PageContainer } from '../components/styleguide/page-container';
import { wrapLeadSentence, LEAD_SENTENCE_CLASS } from '../utils/lead-sentence';
import theme from '../@chakra-ui/gatsby-plugin/theme';

/* Shared with `post-body.tsx`, so every panel starts from today's parity. */
const BASE = `
  p:not(:last-child) {
    margin-bottom: 2rem;
  }
  a {
    color: ${theme.colors.orange.brand};
  }
`;

const Body = styled(Box)`
  ${BASE}
`;

/* 1 — the sentence promoted to its own block above the rest of the paragraph.
   Going to `display: block` is what makes the size jump usable: left inline, a
   1.9em run inside a 1em paragraph drags that one line's leading open and the
   whole block goes ragged. */
const StatementBody = styled(Box)`
  ${BASE}
  .${LEAD_SENTENCE_CLASS} {
    display: block;
    margin-bottom: 1.5rem;
    color: ${theme.colors.blue.brand};
    font-size: 1.85em;
    font-weight: 200;
    line-height: 1.28;
  }
  p:nth-of-type(n + 2) {
    color: ${theme.colors.gray.type};
  }
`;

/* 1b — the same block at the Bold face. 600 rather than 700: gatsby-ssr.js maps
   Edmond Sans Bold to 600 and declares no 700, so 700 only resolves back to
   this same face by nearest-weight matching. */
const StatementBoldBody = styled(Box)`
  ${BASE}
  .${LEAD_SENTENCE_CLASS} {
    display: block;
    margin-bottom: 1.5rem;
    color: ${theme.colors.blue.brand};
    font-size: 1.85em;
    font-weight: 600;
    line-height: 1.28;
  }
  p:nth-of-type(n + 2) {
    color: ${theme.colors.gray.type};
  }
`;

/* 1c — bold with size and tracking pulled back to compensate. The Bold face
   sets wider and darker than the Regular one 1 uses, so holding 1b's size tends
   to leave the block heavier and more open than the light version it replaces. */
const StatementBoldTunedBody = styled(Box)`
  ${BASE}
  .${LEAD_SENTENCE_CLASS} {
    display: block;
    margin-bottom: 1.5rem;
    color: ${theme.colors.blue.brand};
    font-size: 1.6em;
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.22;
  }
  p:nth-of-type(n + 2) {
    color: ${theme.colors.gray.type};
  }
`;

/* 2 — the least invasive version: the sentence stays in the flow at its own
   size, and only colour and weight change. */
const InlineBody = styled(Box)`
  ${BASE}
  .${LEAD_SENTENCE_CLASS} {
    color: ${theme.colors.blue.brand};
    font-weight: 600;
  }
  p:nth-of-type(n + 2) {
    color: ${theme.colors.gray.type};
  }
`;

/* 3 — the sentence set as a kicker: smaller than the body it introduces, but
   louder. Stays inline, so the paragraph still reads as one run of text. */
const KickerBody = styled(Box)`
  ${BASE}
  .${LEAD_SENTENCE_CLASS} {
    font-size: 0.86em;
    font-weight: 600;
    letter-spacing: 0.075em;
    text-transform: uppercase;
    line-height: 1.6;
  }
  p:nth-of-type(n + 2) {
    color: ${theme.colors.gray.type};
  }
`;

/* 4 — highlighted rather than resized. `box-decoration-break: clone` is what
   makes the background wrap correctly: without it the highlight is drawn once
   across the whole inline box and the padding lands only on the first and last
   line. */
const HighlightBody = styled(Box)`
  ${BASE}
  .${LEAD_SENTENCE_CLASS} {
    background-color: ${theme.colors.mint.brandlight};
    box-shadow: 0 0 0 0.3em ${theme.colors.mint.brandlight};
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    line-height: 1.9;
  }
  p:nth-of-type(n + 2) {
    color: ${theme.colors.gray.type};
  }
`;

/* 5 — everything at once, to see where too far is. */
const MaximalBody = styled(Box)`
  ${BASE}
  .${LEAD_SENTENCE_CLASS} {
    display: block;
    margin-bottom: 1.75rem;
    color: ${theme.colors.blue.brand};
    font-size: 1.85em;
    font-weight: 200;
    line-height: 1.3;
  }
  .${LEAD_SENTENCE_CLASS}::first-letter {
    float: left;
    color: ${theme.colors.orange.brand};
    font-size: 2.6em;
    font-weight: 600;
    line-height: 0.76;
    padding-top: 0.05em;
    margin-right: 0.08em;
  }
  .${LEAD_SENTENCE_CLASS}::after {
    content: '';
    display: block;
    clear: both;
    width: 72px;
    margin-top: 1.75rem;
    border-top: 2px solid ${theme.colors.orange.brand};
  }
  p:nth-of-type(n + 2) {
    color: ${theme.colors.gray.type};
  }
`;

type PanelProps = {
  index: number;
  name: string;
  note: string;
  children: ReactNode;
};

const Panel: FunctionComponent<PanelProps> = ({
  index,
  name,
  note,
  children,
}) => (
  <Box>
    <Box
      borderTop="1px solid"
      borderColor="gray.icon"
      paddingTop={3}
      marginTop={20}
    >
      <PageContainer>
        <Text
          fontSize="sm"
          letterSpacing="0.12em"
          textTransform="uppercase"
          color="gray.type"
          marginBottom={1}
        >
          {index} — {name}
        </Text>
        <Text fontSize="sm" color="gray.icon" maxWidth={760} marginBottom={0}>
          {note}
        </Text>
      </PageContainer>
    </Box>
    <Box paddingTop={[6, 8, 10]} paddingBottom={[6, 8, 10]}>
      <PageContainer>{children}</PageContainer>
    </Box>
  </Box>
);

const HomepageBodyVariations: FunctionComponent = () => {
  const data = useStaticQuery(graphql`
    {
      wpPage(customDisplaySettings: { statictemplate: { eq: "homepage" } }) {
        content
      }
    }
  `);

  const { content } = data.wpPage;
  const wrapped = wrapLeadSentence(content);

  /* Held constant across 1-5 so the panels differ only in how the sentence is
     treated, not in how wide the text is set. The alignment is passed inline
     rather than through this object so Chakra can infer it as a TextAlign. */
  const shared = {
    as: 'div' as const,
    fontSize: 'lg',
    maxWidth: 820,
    marginX: 'auto',
  };

  return (
    <Box paddingBottom={24}>
      <PageContainer paddingTop={10}>
        <Heading as="h1" fontSize="2xl" marginBottom={4}>
          Homepage body — first-sentence treatments
        </Heading>
        <Text color="gray.type" maxWidth={760} marginBottom={2}>
          Same WordPress content in all six. The opening sentence is found by a
          string transform over the markup, so the copy stays entirely in WP.
        </Text>
        <Text color="gray.icon" fontSize="sm" maxWidth={760}>
          Sentence detected:{' '}
          <Box as="code" fontSize="sm">
            {(
              new RegExp(
                `<span class="${LEAD_SENTENCE_CLASS}">([\\s\\S]*?)</span>`
              ).exec(wrapped)?.[1] ?? '(none)'
            ).replace(/<[^>]+>/g, '')}
          </Box>
        </Text>
      </PageContainer>

      <Panel
        index={0}
        name="Today"
        note="What ships now: centred at desktop across the full container.xl, both paragraphs at one size and weight, no entry point."
      >
        <Body
          as="div"
          fontSize="lg"
          textAlign={['left', null, 'center']}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Panel>

      <Panel
        index={1}
        name="Statement block"
        note="The sentence lifted out above the rest of the paragraph at display size in brand blue. Strongest hierarchy of the five, and the remainder of paragraph one still reads as its continuation rather than as a new thought."
      >
        <StatementBody
          {...shared}
          textAlign={['left', null, 'center']}
          dangerouslySetInnerHTML={{ __html: wrapped }}
        />
      </Panel>

      <Panel
        index={1.1}
        name="Statement block, bold"
        note="Identical to 1 with one property changed: the sentence set in the Bold face instead of the Regular one. Nothing else moves, so this isolates the weight."
      >
        <StatementBoldBody
          {...shared}
          textAlign={['left', null, 'center']}
          dangerouslySetInnerHTML={{ __html: wrapped }}
        />
      </Panel>

      <Panel
        index={1.2}
        name="Statement block, bold and tuned"
        note="The same bold sentence with size, tracking and leading pulled back to sit at the weight. A straight weight swap usually needs compensating — judge 1.1 for the weight itself and this for whether it needs the adjustment."
      >
        <StatementBoldTunedBody
          {...shared}
          textAlign={['left', null, 'center']}
          dangerouslySetInnerHTML={{ __html: wrapped }}
        />
      </Panel>

      <Panel
        index={2}
        name="Inline colour"
        note="Same size, same flow — only colour and weight change. The most conservative option and the only one that leaves the block's shape completely alone."
      >
        <InlineBody
          {...shared}
          textAlign={['left', null, 'center']}
          dangerouslySetInnerHTML={{ __html: wrapped }}
        />
      </Panel>

      <Panel
        index={3}
        name="Caps kicker"
        note="The sentence set smaller than what follows but in caps, as a lede-in. Reads editorially. Worth checking against the mixed case in the copy — caps will flatten the W. in Lewis W. Butler into the surrounding letters."
      >
        <KickerBody
          {...shared}
          textAlign={['left', null, 'center']}
          dangerouslySetInnerHTML={{ __html: wrapped }}
        />
      </Panel>

      <Panel
        index={4}
        name="Highlight"
        note="Emphasis by background rather than by size, so the measure and rhythm are untouched. The open line-height is needed to keep the highlight bands off each other."
      >
        <HighlightBody
          {...shared}
          textAlign={['left', null, 'center']}
          dangerouslySetInnerHTML={{ __html: wrapped }}
        />
      </Panel>

      <Panel
        index={5}
        name="Maximal"
        note="Statement block plus drop cap plus rule, included to find the ceiling. Needs left-aligned text for the float, so it breaks the centred setting the other panels keep."
      >
        <MaximalBody
          {...shared}
          textAlign="left"
          dangerouslySetInnerHTML={{ __html: wrapped }}
        />
      </Panel>
    </Box>
  );
};

export default HomepageBodyVariations;
