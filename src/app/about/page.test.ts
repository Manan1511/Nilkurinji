import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import AboutPage from "@/app/about/page";
import { StoreNotice } from "@/components/store-notice";

describe("preview about page", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("keeps the story layout without unapproved origin or quality claims", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const page = await AboutPage();
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain("Meet Nilkurinji");
    expect(markup).toContain("The Nilkurinji story is being prepared.");
    const unapprovedClaim = /purest flavours|finest ingredients|born in the Nilgiris|pure by nature|healthier planet/i;
    expect(unapprovedClaim.test(markup)).toBe(false);
    expect(markup).toContain("Concept imagery");
    expect(markup).toContain('href="/shop"');
    expect(markup).not.toContain("<main");
  });

  it("shows preview status visibly and states that purchases are disabled", () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(StoreNotice());

    expect(markup).toContain("Preview storefront");
    expect(markup).toContain('role="status"');
    expect(markup).toContain("Purchases disabled");
  });

  it("keeps unavailable About content customer-facing and links to the shop", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "");
    const markup = renderToStaticMarkup(await AboutPage());

    expect(markup).not.toContain("Shopify");
    expect(markup).not.toContain("Admin");
    expect(markup).toContain("Brand information is temporarily unavailable.");
    expect(markup).toContain('href="/shop"');
  });
});
