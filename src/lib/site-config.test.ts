import { describe, expect, it } from "vitest";
import { CATEGORIES, PRIMARY_NAV } from "@/lib/site-config";

describe("Nilkurinji storefront navigation", () => {
  it("includes all five approved Shopify collection routes in the planned order", () => {
    expect(CATEGORIES.map(({ label, href }) => [label, href])).toEqual([
      ["Tea", "/collections/tea"],
      ["Tea Bags", "/collections/tea-bags"],
      ["Rice", "/collections/rice"],
      ["Snacks", "/collections/snacks"],
      ["Other Foods", "/collections/other-foods"],
    ]);
  });

  it("provides the planned navigation without adding excluded editorial pages", () => {
    expect(PRIMARY_NAV.map(({ href }) => href)).toEqual([
      "/",
      "/shop",
      "/collections/tea",
      "/about",
      "/contact",
    ]);
    expect(PRIMARY_NAV.some(({ href }) => /recipes|journal|tea-guide|newsletter/i.test(href))).toBe(false);
  });
});
