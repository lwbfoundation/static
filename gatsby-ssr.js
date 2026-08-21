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
const TYPOGRAPHY = `
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
      dangerouslySetInnerHTML={{ __html: TYPOGRAPHY }}
    />,
  ]);
}
