import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import ShopPage from "@/app/shop/page";

describe("unified Nilkurinji shop", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("defaults to the tea collection without redundant category tabs", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(await ShopPage({ searchParams: Promise.resolve({}) }));

    expect(markup).toContain("Premium Teas");
    expect(markup).toContain("Discover the rich taste, aroma and warmth");
    expect(markup).not.toContain('aria-label="Shop categories"');
  });

  it("falls back to tea when an inactive category is requested", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(await ShopPage({ searchParams: Promise.resolve({ category: "rice" }) }));

    expect(markup).not.toContain('href="/shop?category=rice"');
    expect(markup).toContain("Premium Teas");
    expect(markup).not.toContain("Basmati Rice Preview");
  });

  it("keeps live catalog failures honest and does not show preview hero assets", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "");
    const markup = renderToStaticMarkup(await ShopPage({ searchParams: Promise.resolve({}) }));

    expect(markup).toContain("Shop listings are temporarily unavailable.");
    expect(markup).not.toContain("preview-hero-home-v4.png");
    expect(markup).not.toContain("Basmati Rice Preview");
  });
});
