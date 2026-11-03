import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { HomeReviews } from "./home-reviews";

describe("homepage reviews", () => {
  it("renders all twelve supplied customer reviews with their attribution", () => {
    const html = renderToStaticMarkup(createElement(HomeReviews));

    expect(html).toContain("The Nilkurinji Journal");
    expect(html).toContain("Real stories, honest experiences and love shared by our customers.");
    expect(html.match(/aria-roledescription="slide"/g)).toHaveLength(12);
    expect(html).toContain("Rituparna bhattacharjee");
    expect(html).toContain("Guwahati, Assam");
    expect(html).toContain("I actually really loved it ,the aroma ,strong colour &amp; taste - overall a very fine quality tea 😊.");
    expect(html).toContain("Neha Kumar");
    expect(html).toContain("⭐⭐⭐⭐⭐");
    expect(html).not.toContain("Illustrative mock reviews");
    expect(html).not.toContain("Preview sample");
    expect(html).not.toContain("Mira S.");
  });

  it("uses a different decorative image for each review card", () => {
    const html = renderToStaticMarkup(createElement(HomeReviews));
    const imageSources = Array.from(html.matchAll(/src="([^"]+)"/g), (match) => decodeURIComponent(match[1] ?? ""));
    const reviewPhotoSources = imageSources.filter((source) => source?.includes("/images/") && !source.includes("/botanical/"));

    expect(reviewPhotoSources).toHaveLength(12);
    expect(new Set(reviewPhotoSources).size).toBe(12);
  });
});
