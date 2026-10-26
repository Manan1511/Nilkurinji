import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BotanicalEdges } from "@/components/botanical-edges";

describe("section-specific botanical edges", () => {
  it("uses a distinct branch pair for the header, hero and featured shelf", () => {
    const regions = [
      ["header", "botanical-header-left-refined.webp", "botanical-header-right-refined.webp"],
      ["home-hero", "botanical-home-hero-left-refined.webp", "botanical-home-hero-right-refined.webp"],
      ["featured", "botanical-categories-left.webp", "botanical-categories-right-kurinji.webp"],
    ] as const;

    for (const [placement, leftAsset, rightAsset] of regions) {
      const markup = renderToStaticMarkup(createElement(BotanicalEdges, { placement }));
      expect(markup).toContain(leftAsset);
      expect(markup).toContain(rightAsset);
    }
  });

  it("uses the editorial pair for editorial banners and the story page only", () => {
    const banner = renderToStaticMarkup(createElement(BotanicalEdges, { placement: "banner" }));
    const story = renderToStaticMarkup(createElement(BotanicalEdges, { placement: "story" }));

    for (const asset of ["botanical-editorial-left.webp", "botanical-editorial-right-kurinji.webp"]) {
      expect(banner).toContain(asset);
      expect(story).toContain(asset);
    }
    expect(banner).not.toContain("botanical-header-left-refined.webp");
    expect(banner).not.toContain("botanical-home-hero-left-refined.webp");
    expect(banner).not.toContain("botanical-categories-left.webp");
  });
});
