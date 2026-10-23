import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const route = vi.hoisted(() => ({ pathname: "/", search: "" }));

vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
  useSearchParams: () => new URLSearchParams(route.search),
}));

import { SiteHeader } from "@/components/site-header";

describe("shared storefront header", () => {
  it("keeps the same header layout on home, shop, and product pages", () => {
    const headerClasses = ["/", "/shop", "/products/preview-tea-1"].map((pathname) => {
      route.pathname = pathname;
      const markup = renderToStaticMarkup(createElement(SiteHeader));
      return markup.match(/<header class="([^"]+)"/)?.[1];
    });

    expect(headerClasses.every(Boolean)).toBe(true);
    expect(new Set(headerClasses).size).toBe(1);
  });

  it("keeps the shared logo focused on the wordmark", () => {
    const markup = renderToStaticMarkup(createElement(SiteHeader));

    expect(markup).toContain("NILKURINJI");
    expect(markup).not.toContain("Food &amp; beverages");
  });

  it("does not expose the retired pantry navigation", () => {
    route.pathname = "/shop";
    route.search = "";
    const markup = renderToStaticMarkup(createElement(SiteHeader));
    expect(markup).not.toContain('href="/shop?category=pantry"');
    expect(markup).not.toContain(">Pantry</a>");
    route.pathname = "/";
    route.search = "";
  });

  it("uses one Shop destination and removes wishlist navigation", () => {
    route.pathname = "/shop";
    const markup = renderToStaticMarkup(createElement(SiteHeader));
    expect(markup).toContain('href="/shop">Shop</a>');
    expect(markup).not.toContain("/collections/tea");
    expect(markup).not.toContain("/wishlist");
    expect(markup).not.toContain("Wishlist");
    route.pathname = "/";
  });

  it("submits a product query from the header instead of linking to a blank search page", () => {
    const markup = renderToStaticMarkup(createElement(SiteHeader));

    expect(markup).toContain('action="/search"');
    expect(markup).toContain('name="q"');
    expect(markup).toContain('placeholder="Search tea and tea bags"');
    expect(markup).not.toContain('href="/search"');
  });

  it("exposes an expandable mobile search control with its current state", () => {
    const markup = renderToStaticMarkup(createElement(SiteHeader));

    expect(markup).toContain('aria-label="Search products"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-controls="header-search-panel"');
  });
});
