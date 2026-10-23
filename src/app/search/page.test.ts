import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import SearchPage from "@/app/search/page";

describe("unavailable search page", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("hides storefront setup errors and offers a shopper route", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "");
    vi.stubEnv("SHOPIFY_API_VERSION", "");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "");
    const markup = renderToStaticMarkup(await SearchPage({ searchParams: Promise.resolve({ q: "tea" }) }));

    expect(markup).not.toContain("Live Shopify storefront configuration is incomplete.");
    expect(markup).not.toContain("incomplete");
    expect(markup).toContain("Search is temporarily unavailable.");
    expect(markup).toContain('href="/shop"');
  });

  it("offers shop format filters when a query has no results", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(await SearchPage({ searchParams: Promise.resolve({ q: "no-matching-tea-92849" }) }));

    expect(markup).toContain("No products found for");
    expect(markup).toContain('href="/shop?category=tea"');
    expect(markup).toContain('href="/shop?category=tea-bags"');
    expect(markup).not.toContain("/collections/");
    expect(markup).not.toContain("clearing a filter");
  });
});
