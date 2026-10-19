import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import AboutPage from "@/app/about/page";

describe("preview about page", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("matches the supplied story composition without a preview disclaimer", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const page = await AboutPage();
    const markup = renderToStaticMarkup(page);

    expect(markup).not.toContain("Preview story and concept imagery");
    expect(markup).toMatch(/More Than\s+Just Tea/);
    expect(markup).toContain("Pure by Nature");
    expect(markup).toContain("Born in the Nilgiris");
    expect(markup).toContain("Good Tea");
    expect(markup).toContain('class="about-origin__seal"');
    expect(markup).toContain('class="about-values__aside"');
    expect(markup).not.toContain("<main");
  });
});
