import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import ShopPage from "@/app/shop/page";

describe("unavailable shop page", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("hides storefront setup errors and offers a shopper route", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "");
    vi.stubEnv("SHOPIFY_API_VERSION", "");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "");
    const markup = renderToStaticMarkup(await ShopPage({ searchParams: Promise.resolve({}) }));

    expect(markup).not.toContain("Live Shopify storefront configuration is incomplete.");
    expect(markup).not.toContain("incomplete");
    expect(markup).toContain("Tea listings are temporarily unavailable.");
    expect(markup).toContain('href="/"');
  });

  it("leads with a clear shop heading instead of a repeated collection label", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(await ShopPage({ searchParams: Promise.resolve({}) }));

    expect(markup).toContain("Find your tea.");
    expect(markup).toContain("Loose tea to linger over. Tea bags to keep things simple.");
    expect(markup).not.toContain("THE NILKURINJI TEA COLLECTION");
  });

  it("applies a selected tea format on the single shop page", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(await ShopPage({ searchParams: Promise.resolve({ category: "tea-bags" }) }));

    expect(markup).toContain('data-category="tea-bags" aria-pressed="true"');
    expect(markup).not.toContain('data-category="tea" aria-pressed="true"');
  });
});
