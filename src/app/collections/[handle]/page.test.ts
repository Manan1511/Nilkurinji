import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CollectionPage from "@/app/collections/[handle]/page";

describe("preview collection copy", () => {
  afterEach(() => vi.unstubAllEnvs());

  it.each([
    ["tea", "Browse example tea products in this preview."],
    ["tea-bags", "Browse example tea bag products in this preview."],
  ])("uses neutral copy for the %s collection", async (handle, expectedDescription) => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(await CollectionPage({ params: Promise.resolve({ handle }) }));
    const unsupportedClaims = [
      "100% Natural Ingredients",
      "Pure, Safe, Wholesome.",
      "Authentic Indian Heritage",
      "Premium Quality",
      "Carefully sourced, Always.",
      "handcrafted teas made from the finest leaves",
      "pure ingredients, in every cup",
      "Real Ingredients. Better Moments.",
      "Good Tea",
      "Better Days",
      "Same great taste",
    ];

    const visibleClaims = unsupportedClaims.filter((claim) => markup.includes(claim));
    expect(visibleClaims).toEqual([]);
    expect(markup).toContain(expectedDescription);
  });

  it("shows the Tea type selector once and retains secondary Tea filters", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(await CollectionPage({ params: Promise.resolve({ handle: "tea" }) }));

    expect(markup).toContain('aria-label="Filter teas by type"');
    expect(markup.includes('<legend>Type</legend>')).toBe(false);
    expect(markup).toContain("Caffeine");
    expect(markup).toContain("Price");
  });

  it("hides live catalog setup errors and gives shoppers a next step", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "");
    vi.stubEnv("SHOPIFY_API_VERSION", "");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "");
    const markup = renderToStaticMarkup(await CollectionPage({ params: Promise.resolve({ handle: "tea" }) }));

    expect(markup).not.toContain("Live Shopify storefront configuration is incomplete.");
    expect(markup).not.toContain("incomplete");
    expect(markup).toContain("Collection information is temporarily unavailable.");
    expect(markup).toContain('href="/shop"');
  });
});
