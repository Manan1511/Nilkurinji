import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import ShopPage from "@/app/shop/page";

describe("unified Nilkurinji shop", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("shows the compact category banner and every approved category", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(await ShopPage({ searchParams: Promise.resolve({}) }));

    expect(markup).toContain("Explore the Nilkurinji pantry");
    expect(markup).toContain('aria-label="Shop categories"');
    for (const category of ["All", "Tea", "Tea Bags", "Rice", "Snacks", "Other Foods"]) expect(markup).toContain(category);
    expect(markup).toContain('href="/shop?category=rice"');
  });

  it("marks the selected category and supports food categories on the same shop page", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(await ShopPage({ searchParams: Promise.resolve({ category: "rice" }) }));

    expect(markup).toContain('aria-current="page" href="/shop?category=rice"');
    expect(markup).toContain("Basmati Rice Preview");
    expect(markup).not.toContain("tea collection is being prepared");
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
