import { describe, expect, it } from "vitest";
import { CATEGORIES, PRIMARY_NAV } from "@/lib/site-config";

describe("Nilkurinji storefront navigation", () => {
  it("keeps all merchandise categories inside the single shop route", () => {
    expect(CATEGORIES.map(({ label, href }) => [label, href])).toEqual([
      ["Tea", "/shop?category=tea"],
      ["Tea Bags", "/shop?category=tea-bags"],
      ["Rice", "/shop?category=rice"],
      ["Snacks", "/shop?category=snacks"],
      ["Other Foods", "/shop?category=other-foods"],
    ]);
  });

  it("uses the approved global primary navigation", () => {
    expect(PRIMARY_NAV.map(({ href }) => href)).toEqual([
      "/",
      "/shop",
      "/tea-guide",
      "/recipes",
      "/journal",
      "/contact",
    ]);
  });
});
