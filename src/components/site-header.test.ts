import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const route = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
}));

import { SiteHeader } from "@/components/site-header";

describe("shared storefront header", () => {
  it("keeps the same header layout on home, shop, and collection pages", () => {
    const headerClasses = ["/", "/shop", "/collections/tea"].map((pathname) => {
      route.pathname = pathname;
      const markup = renderToStaticMarkup(createElement(SiteHeader));
      return markup.match(/<header class="([^"]+)"/)?.[1];
    });

    expect(headerClasses.every(Boolean)).toBe(true);
    expect(new Set(headerClasses).size).toBe(1);
  });

  it("uses a neutral shared store descriptor", () => {
    const markup = renderToStaticMarkup(createElement(SiteHeader));

    expect(markup).toContain("Food &amp; beverages");
    expect(markup).not.toContain("Premium food");
  });

  it("submits a product query from the header instead of linking to a blank search page", () => {
    const markup = renderToStaticMarkup(createElement(SiteHeader));

    expect(markup).toContain('action="/search"');
    expect(markup).toContain('name="q"');
    expect(markup).toContain('placeholder="Search tea and pantry"');
    expect(markup).not.toContain('href="/search"');
  });

  it("exposes an expandable mobile search control with its current state", () => {
    const markup = renderToStaticMarkup(createElement(SiteHeader));

    expect(markup).toContain('aria-label="Search products"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-controls="header-search-panel"');
  });
});
