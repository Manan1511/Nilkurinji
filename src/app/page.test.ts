import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("homepage composition", () => {
  it("uses the approved hero copy and avoids unsupported claims", async () => {
    const markup = renderToStaticMarkup(await HomePage());
    expect(markup).toContain("A Taste of Nature,");
    expect(markup).toContain("Crafted for You");
    expect(markup).toContain("Fine tea, thoughtful blends and pantry essentials for everyday moments.");
    for (const claim of ["100% Natural Ingredients", "Authentic Indian Heritage", "Pure, Safe, Wholesome."]) expect(markup).not.toContain(claim);
  });
  it("keeps the homepage independent of catalog availability", async () => {
    const markup = renderToStaticMarkup(await HomePage());
    expect(markup).not.toContain("Shopify");
    expect(markup).not.toContain("Headless");
    expect(markup).toContain('href="/shop?category=tea"');
    expect(markup).toContain("Our Categories");
  });
});
