import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PolicyPage from "@/app/pages/[handle]/page";

describe("unavailable policy page", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("keeps missing policy copy shopper-facing and links back to the shop", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "");
    const markup = renderToStaticMarkup(await PolicyPage({ params: Promise.resolve({ handle: "privacy-policy" }) }));

    expect(markup).not.toContain("Shopify");
    expect(markup).not.toContain("Admin");
    expect(markup).toContain("This policy page is temporarily unavailable.");
    expect(markup).toContain('href="/shop"');
  });
});
