/**
 * Wraps the first sentence of a WordPress body's first paragraph in a span, so
 * the front end can give it its own treatment without the copy leaving WP.
 *
 * This is a pure string transform: it runs identically under SSR and hydration,
 * and can be lifted into `createResolvers` in gatsby-node to run once at build
 * time instead of per render.
 */

/**
 * A period does not end a sentence when what precedes it is an initial or a
 * known abbreviation. This matters immediately here: the homepage body opens
 * "Lewis W. Butler", and both `Intl.Segmenter` and any plain `/[.!?]/` split
 * cut it to "Lewis W." — the UAX#29 rules break after an initial followed by a
 * capital, which is exactly the shape of a name.
 */
const ABBREVIATION =
  /(?:^|[\s(])(?:[A-Z]|Mr|Mrs|Ms|Dr|Prof|Rev|St|Jr|Sr|Inc|Ltd|Co|Corp|Dept|Univ|Assn|Ave|Blvd|No|vs|etc|al|approx|Fig|Vol|e\.g|i\.e|AIA|FAIA|LEED)$/;

const SENTENCE_END = /([.!?])(["'’”)\]]*)(\s+|$)/g;

/** Offset just past the first sentence, or -1 if the text is a single sentence. */
const firstSentenceEnd = (text: string): number => {
  const re = new RegExp(SENTENCE_END.source, 'g');
  let match = re.exec(text);
  while (match !== null) {
    const end = match.index + match[0].length;
    const before = text.slice(0, match.index);
    const after = text.slice(end);
    const isAbbreviation = ABBREVIATION.test(before);
    // A real boundary is followed by something that opens a sentence. This is
    // what catches "Butler Armsden Inc. every year", where the abbreviation
    // list alone would not.
    const opensNextSentence = after === '' || /^["'“([]?[A-Z0-9]/.test(after);
    if (!isAbbreviation && opensNextSentence) return end;
    match = re.exec(text);
  }
  return -1;
};

type TextIndex = {
  text: string;
  /** `map[i]` is where `text[i]` sits in the original html. */
  map: number[];
};

/** Flattens html to its text, keeping a position map back into the markup. */
const indexText = (html: string): TextIndex => {
  let text = '';
  const map: number[] = [];
  let inTag = false;
  for (let i = 0; i < html.length; i += 1) {
    const char = html[i];
    if (char === '<') inTag = true;
    else if (char === '>') inTag = false;
    else if (!inTag) {
      map.push(i);
      text += char;
    }
  }
  return { text, map };
};

/** True when the cut point sits inside an inline element opened before it. */
const isInsideOpenTag = (html: string, cut: number): boolean => {
  const before = html.slice(0, cut);
  const opens = (before.match(/<(?!\/)([a-zA-Z][^\s/>]*)/g) ?? []).filter(
    (tag) => !/^<(br|img|hr|input|wbr)$/i.test(tag)
  ).length;
  const closes = (before.match(/<\/[a-zA-Z]/g) ?? []).length;
  return opens > closes;
};

export const LEAD_SENTENCE_CLASS = 'lead-sentence';

export const wrapLeadSentence = (
  html: string,
  className: string = LEAD_SENTENCE_CLASS
): string => {
  const paragraph = /<p\b[^>]*>([\s\S]*?)<\/p>/i.exec(html);
  if (!paragraph) return html;

  const inner = paragraph[1];
  const innerStart = paragraph.index + paragraph[0].indexOf(inner);
  const { text, map } = indexText(inner);
  if (text.trim() === '') return html;

  const sentenceEnd = firstSentenceEnd(text);
  // A single-sentence paragraph gets wrapped whole rather than skipped, so the
  // treatment still applies to a body someone rewrites down to one line.
  let cutInText = sentenceEnd === -1 ? text.length : sentenceEnd;
  // Leave the trailing space outside the span; inside it, a highlight or
  // underline would run past the full stop.
  while (cutInText > 0 && /\s/.test(text[cutInText - 1])) cutInText -= 1;

  const cutInInner =
    cutInText >= map.length ? inner.length : map[cutInText - 1] + 1;
  // Closing the span mid-nesting would produce invalid markup, so a sentence
  // that ends inside an <em>/<a> falls back to wrapping the paragraph.
  const cut = isInsideOpenTag(inner, cutInInner) ? inner.length : cutInInner;

  return `${html.slice(0, innerStart)}<span class="${className}">${inner.slice(
    0,
    cut
  )}</span>${inner.slice(cut)}${html.slice(innerStart + inner.length)}`;
};

export default wrapLeadSentence;
