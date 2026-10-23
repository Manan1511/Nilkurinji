import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ContactPage from "@/app/contact/page";

describe("unavailable contact page", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("keeps missing contact information shopper-facing", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "");
    const markup = renderToStaticMarkup(await ContactPage());

    expect(markup).not.toContain("Shopify");
    expect(markup).not.toContain("incomplete");
    expect(markup).toContain("Contact information is temporarily unavailable.");
    expect(markup).toContain('href="/shop"');
  });
});
