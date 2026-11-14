import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import HomePage from "./page";

it("shows the mountain hero and the four tea collection links", async () => {
  const html = renderToStaticMarkup(await HomePage());
  expect(html).toContain("nilkurinji-mountain-home-desktop.webp");
  expect(html).toContain("nilkurinji-mountain-home-mobile.webp");
  expect(html).toContain('href="/shop?category=tea"');
  expect(html).toContain('aria-label="Nilkurinji Premium Tea Collection"');
  for (const name of ["Classic Tea", "Elaichi Tea", "Rose Tea", "Masala Tea"]) expect(html).toContain(name);
  expect(html).toContain('aria-label="Masala Tea, coming soon"');
  for (const image of ["classic-category.webp", "elaichi-category.webp", "rose-category.webp", "masala-category.webp"]) expect(html).toContain(image);
  expect(html).not.toContain('aria-labelledby="home-featured-heading"');
});

it("places the reels and story before customer reviews", async () => {
  const html = renderToStaticMarkup(await HomePage());
  expect(html.indexOf('id="reels-heading"')).toBeGreaterThan(html.indexOf('id="home-categories-heading"'));
  expect(html.indexOf('id="home-story-heading"')).toBeGreaterThan(html.indexOf('id="reels-heading"'));
  expect(html.indexOf('id="home-reviews-heading"')).toBeGreaterThan(html.indexOf('id="home-story-heading"'));
  expect(html).toContain('href="/our-story"');
});

it("shows the customer reviews on the homepage", async () => {
  const html = renderToStaticMarkup(await HomePage());
  expect(html).toContain("The Nilkurinji Journal");
  expect(html).toContain("Real stories, honest experiences and love shared by our customers.");
  expect(html).toContain("Rituparna");
});
