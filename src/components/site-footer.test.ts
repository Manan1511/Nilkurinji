import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SiteFooter } from "./site-footer";

describe("Nilkurinji global footer", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("links every approved category and editorial destination through the shared shell", () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(createElement(SiteFooter));

    expect(markup).toContain('href="/shop?category=tea"');
    expect(markup).toContain('href="/shop?category=tea-bags"');
    expect(markup).toContain('href="/shop?category=rice"');
    expect(markup).toContain('href="/shop?category=snacks"');
    expect(markup).toContain('href="/shop?category=other-foods"');
    expect(markup).toContain('href="/our-story"');
    expect(markup).toContain('href="/tea-guide"');
    expect(markup).toContain('href="/recipes"');
    expect(markup).toContain('href="/journal"');
    expect(markup).toContain('href="/shipping-and-returns"');
    expect(markup).toContain("Contact");
    expect(markup).not.toContain("For slow starts, busy middles, and second cups.");
  });

  it("does not reserve an empty column when there are no verified social links", () => {
    const markup = renderToStaticMarkup(createElement(SiteFooter, { socialLinks: [] }));
    const withSocials = renderToStaticMarkup(createElement(SiteFooter, { socialLinks: [{ label: "Instagram", href: "https://instagram.com/nilkurinji" }] }));

    expect(markup).not.toMatch(/socialBlock/);
    expect(withSocials).toMatch(/socialBlock/);
    expect(withSocials).toContain("Instagram");
  });

  it("renders two complete, decorative botanical branches with the footer signature", () => {
    const markup = renderToStaticMarkup(createElement(SiteFooter));

    expect(markup).toContain('src="/images/footer-botanical-left.svg"');
    expect(markup).toContain('src="/images/footer-botanical-right.svg"');
    expect(markup.match(/aria-hidden="true"/g)?.length).toBeGreaterThanOrEqual(2);
  });
});
