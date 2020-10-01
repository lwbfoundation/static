import React from "react";

export function onRenderBody({
  setHeadComponents
}) {
  setHeadComponents([
    <link rel="preload" href="/fonts/TradeGothicLTStd-Bd2.otf" as="font" type="font/otf" crossorigin="anonymous" />
  ])
}
