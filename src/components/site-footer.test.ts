import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SiteFooter } from "./site-footer";

describe("tea-only storefront footer", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("links formats to the single shop page and removes wishlist navigation", () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(createElement(SiteFooter));

    expect(markup).toContain('href="/shop?category=tea"');
    expect(markup).toContain('href="/shop?category=tea-bags"');
    expect(markup).not.toContain('href="/wishlist"');
    expect(markup).not.toContain("Wishlist");
    expect(markup).not.toContain('href="/shop?category=pantry"');
    expect(markup).not.toContain('href="/collections/rice"');
    expect(markup).not.toContain('href="/collections/snacks"');
  });
});
