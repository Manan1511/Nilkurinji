import { describe, expect, it } from "vitest";
import { CATEGORIES, PRIMARY_NAV } from "@/lib/site-config";

describe("Nilkurinji storefront navigation", () => {
  it("keeps tea formats as filters within the single shop route", () => {
    expect(CATEGORIES.map(({ label, href }) => [label, href])).toEqual([
      ["Tea", "/shop?category=tea"],
      ["Tea Bags", "/shop?category=tea-bags"],
    ]);
  });

  it("keeps primary navigation focused on one shop page and brand information", () => {
    expect(PRIMARY_NAV.map(({ href }) => href)).toEqual([
      "/shop",
      "/about",
    ]);
    expect(PRIMARY_NAV.some(({ href }) => /recipes|journal|tea-guide|newsletter/i.test(href))).toBe(false);
  });
});
