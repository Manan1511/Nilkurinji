import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProductPage from "@/app/products/[handle]/page";

describe("unavailable product page", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("hides storefront setup errors and offers a shopper route", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "");
    vi.stubEnv("SHOPIFY_API_VERSION", "");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "");
    const markup = renderToStaticMarkup(await ProductPage({ params: Promise.resolve({ handle: "preview-tea-1" }) }));

    expect(markup).not.toContain("Live Shopify storefront configuration is incomplete.");
    expect(markup).not.toContain("Shopify catalog");
    expect(markup).toContain("Product information is temporarily unavailable.");
    expect(markup).toContain('href="/shop"');
  });
});

it("does not render wishlist controls on related product cards", async () => {
  vi.stubEnv("SHOPIFY_MODE", "preview");
  const markup = renderToStaticMarkup(await ProductPage({ params: Promise.resolve({ handle: "preview-tea-1" }) }));
  expect(markup).not.toContain("wishlist");
});
