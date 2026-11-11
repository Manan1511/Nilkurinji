import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { CUSTOMER_REVIEWS } from "@/lib/customer-reviews";
import { HomeReviews } from "./home-reviews";

describe("homepage reviews", () => {
  it("includes every supplied customer review in the accessible carousel", () => {
    const html = renderToStaticMarkup(createElement(HomeReviews));
    expect(html).toContain('id="customer-reviews"');
    for (const review of CUSTOMER_REVIEWS) {
      expect(html).toContain(review.name);
      expect(html).toContain(review.location.replaceAll("&", "&amp;"));
    }
    expect(CUSTOMER_REVIEWS).toHaveLength(12);
    expect(html).toMatch(/aria-hidden="true"[^>]*inert=""/);
  });
});
