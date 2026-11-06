import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { HomeHero } from "./home-hero";

it("keeps the approved headline in two phrases and links to tea", () => {
  const markup = renderToStaticMarkup(createElement(HomeHero, {
    eyebrow: "TEA · TEA BAGS · PANTRY",
    heading: "A Taste of Nature, Crafted for You",
    description: "Fine tea, thoughtful blends and pantry essentials for everyday moments.",
    image: null,
  }));
  expect(markup).toContain("A Taste of Nature,<br/>Crafted for You");
  expect(markup).toContain('href="/shop?category=tea"');
});
