import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { HomeReviews } from "./home-reviews";
import { makeProduct } from "../../../test/fixtures/storefront";

describe("homepage reviews", () => {
  const product = makeProduct({ handle: "premium-tea", title: "Nilkurinji Premium Tea", isPreview: false });

  it("shows sample reviews with Shopify products during preview", () => {
    const html = renderToStaticMarkup(createElement(HomeReviews, { products: [product], preview: true }));
    expect(html).toContain("Notes from Tea Lovers");
    expect(html).not.toContain("Illustrative mock reviews");
    expect(html).toContain("mock rating");
    expect(html).not.toContain("Preview sample");
    expect(html).toContain("/products/premium-tea");
  });

  it("does not show sample reviews in a purchasing-enabled storefront", () => {
    expect(renderToStaticMarkup(createElement(HomeReviews, { products: [product], preview: false }))).toBe("");
  });

  it("prefers approved customer reviews over preview samples", () => {
    const reviewed = makeProduct({ approvedReviews: [{ name: "Customer", rating: 5, title: "Lovely", body: "A lovely tea.", date: null }] });
    const html = renderToStaticMarkup(createElement(HomeReviews, { products: [reviewed], preview: true }));
    expect(html).toContain("A lovely tea.");
    expect(html).not.toContain("Preview sample");
  });
});
