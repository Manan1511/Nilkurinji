import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BotanicalEdges } from "./botanical-edges";

describe("botanical framing", () => {
  it("keeps the right-hand branches out of the mountain hero", () => {
    const html = renderToStaticMarkup(createElement(BotanicalEdges, { placement: "home-hero" }));
    expect(html).not.toContain("botanical-home-hero-right-refined");
    expect(html).not.toContain("botanical-editorial-right-kurinji");
    expect(html).toContain("botanical-home-hero-left-refined");
  });

  it("retains the header's right-hand branches", () => {
    const html = renderToStaticMarkup(createElement(BotanicalEdges, { placement: "header" }));
    expect(html).toContain("botanical-header-right-refined");
  });

  it("keeps distinct header and featured branch pairs", () => {
    const regions = [
      ["header", "botanical-header-left-refined.webp", "botanical-header-right-refined.webp"],
      ["featured", "botanical-categories-left.webp", "botanical-categories-right-kurinji.webp"],
    ] as const;
    for (const [placement, left, right] of regions) {
      const html = renderToStaticMarkup(createElement(BotanicalEdges, { placement }));
      expect(html).toContain(left);
      expect(html).toContain(right);
    }
  });

  it("uses the editorial pair for banners and story", () => {
    for (const placement of ["banner", "story"] as const) {
      const html = renderToStaticMarkup(createElement(BotanicalEdges, { placement }));
      expect(html).toContain("botanical-editorial-left.webp");
      expect(html).toContain("botanical-editorial-right-kurinji.webp");
      expect(html).not.toContain("botanical-header-left-refined.webp");
      expect(html).not.toContain("botanical-home-hero-left-refined.webp");
      expect(html).not.toContain("botanical-categories-left.webp");
    }
  });
});
