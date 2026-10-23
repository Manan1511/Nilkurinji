import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "@/app/page";

describe("preview homepage copy", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("does not present unapproved social proof, quality, ingredient, or shipping claims", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(await HomePage());
    const unsupportedClaims = [
      "Our Best Sellers",
      "loved by many",
      "wholesome range of premium foods",
      "100% Natural Ingredients",
      "Pure, Safe, Wholesome.",
      "Authentic Indian Heritage",
      "Premium Quality",
      "Pan India Delivery",
      "Carefully sourced, Always.",
    ];

    const visibleClaims = unsupportedClaims.filter((claim) => markup.includes(claim));
    expect(visibleClaims).toEqual([]);
    expect(markup).toContain("Make a little room for tea.");
    expect(markup).toContain("Loose tea when you want to linger. Tea bags when you want to keep it simple.");
    expect(markup).toContain("No perfect cup required.");
    expect(markup).toContain("A quiet start, a quick break, one more cup after lunch.");
    expect(markup).toContain("botanical-tea-spray.webp");
    expect(markup).toContain("category-icon-tea.png");
    expect(markup).toContain("category-icon-tea-bags.png");
    expect(markup).not.toContain("Alongside your tea.");
    expect(markup).not.toContain('href="/collections/rice"');
  });

  it("keeps Shopify setup details out of the unavailable home page", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "");
    const markup = renderToStaticMarkup(await HomePage());

    expect(markup).not.toContain("Shopify");
    expect(markup).not.toContain("Headless");
    expect(markup).toContain("Tea listings are temporarily unavailable.");
    expect(markup).toContain('href="/shop"');
  });
});
