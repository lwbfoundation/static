import React from 'react';

/**
 * Typography lives in the document head rather than in a component's emotion
 * `<Global>` styles. Those are injected as the component renders — so they land
 * after the markup on first paint, and, because `HeadContent` renders inside
 * the page component, they are torn down and re-created on every route change.
 * With the `@font-face` rules briefly gone the browser drops back to a system
 * font, which is the flash on load and navigation. Here they are parsed before
 * the body and never unmount.
 */
const HEAD_STYLES = `
@font-face {
  font-family: 'Edmond Sans';
  src: url('/fonts/Edmondsans-Bold.woff2') format('woff2'),
       url('/fonts/Edmondsans-Bold.otf') format('opentype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Edmond Sans';
  src: url('/fonts/Edmondsans-Medium.woff2') format('woff2'),
       url('/fonts/Edmondsans-Medium.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Edmond Sans';
  src: url('/fonts/Edmondsans-Regular.woff2') format('woff2'),
       url('/fonts/Edmondsans-Regular.otf') format('opentype');
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}

/*
 * Overscrolling past either end of the page reveals the canvas, which takes
 * its colour from the root element. Brand blue there, white on the page itself,
 * so the bands top and bottom read as the site rather than as a bare document.
 *
 * The white sits on the app root and not on the body because the scholar artwork
 * is laid out at a negative z-index: in the root stacking context that would
 * put it behind a painted body background. Giving the app root a stacking
 * context of its own keeps the artwork above this white and still behind the
 * page content. It also has to be a block formatting context, or the first
 * block's top margin collapses out through it and starts the white below the
 * top of the document, leaving a blue bar there.
 */
html {
  background-color: #185b78;
}

#___gatsby {
  background-color: #ffffff;
  display: flow-root;
  isolation: isolate;
  min-height: 100vh;
}
`;

/** The two weights the site actually sets; 200 is left to load on demand. */
const PRELOADED = ['Edmondsans-Medium', 'Edmondsans-Bold'];

export function onRenderBody({ setHeadComponents }) {
  setHeadComponents([
    ...PRELOADED.map((name) => (
      <link
        key={`preload-${name}`}
        rel="preload"
        href={`/fonts/${name}.woff2`}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    )),
    <style
      key="typography"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: HEAD_STYLES }}
    />,
  ]);
}
