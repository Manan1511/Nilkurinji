import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/shopify/mode", () => ({ getStorefrontMode: () => ({ mode: "live" }) }));
vi.mock("@/lib/shopify/server", () => ({ shopifyQuery: vi.fn(), getBuyerIp: () => undefined }));
import { getEnabledCategoryHandles, normalizeShopCategoryBanner } from "@/lib/shopify/shop-category";
import { shopifyQuery } from "@/lib/shopify/server";

beforeEach(() => vi.resetAllMocks());

describe("Shop category banner content", () => {
  it("reads heading, copy, desktop/mobile media and accessible text from the Shopify metaobject", () => {
    const bannerImage = { url: "https://cdn.shopify.com/files/tea-banner.jpg", altText: "Tea leaves and a cup", width: 2400, height: 420 };
    const mobileImage = { url: "https://cdn.shopify.com/files/tea-banner-mobile.jpg", altText: "Tea leaves beside a cup", width: 1200, height: 900 };
    const result = normalizeShopCategoryBanner([
      { key: "title", value: "Loose tea" },
      { key: "intro", value: "A short category description." },
      { key: "banner", value: null, reference: { fields: [
        { key: "eyebrow", value: "NILKURINJI · TEA" },
        { key: "heading", value: "Loose tea for every day" },
        { key: "body", value: "A calm, approved description." },
        { key: "image_alt", value: "Tea leaves and a cup" },
        { key: "desktop_image", value: null, reference: { image: bannerImage } },
        { key: "mobile_image", value: null, reference: { image: mobileImage } },
      ] } },
    ]);

    expect(result).toEqual({ eyebrow: "NILKURINJI · TEA", heading: "Loose tea for every day", body: "A calm, approved description.", image: bannerImage, mobileImage, altText: "Tea leaves and a cup" });
  });

  it("does not invent a banner when the Shopify entry has no usable content", () => {
    expect(normalizeShopCategoryBanner([])).toBeNull();
  });
});

describe("category visibility", () => {
  it("defaults to Tea when category entries are missing", async () => {
    vi.mocked(shopifyQuery).mockResolvedValue({ metaobject: null });
    expect(await getEnabledCategoryHandles()).toEqual(["tea"]);
  });

  it("honours explicit Shopify enabled and disabled values", async () => {
    vi.mocked(shopifyQuery)
      .mockResolvedValueOnce({ metaobject: { fields: [{ key: "enabled", value: "false" }] } })
      .mockResolvedValueOnce({ metaobject: { fields: [{ key: "enabled", value: "true" }] } })
      .mockResolvedValueOnce({ metaobject: { fields: [{ key: "enabled", value: "true" }] } })
      .mockResolvedValueOnce({ metaobject: { fields: [{ key: "enabled", value: "false" }] } })
      .mockResolvedValueOnce({ metaobject: null });
    expect(await getEnabledCategoryHandles()).toEqual(["tea-bags", "rice"]);
  });

  it("uses the Tea-only default when Shopify is unavailable", async () => {
    vi.mocked(shopifyQuery).mockRejectedValue(new Error("unavailable"));
    expect(await getEnabledCategoryHandles()).toEqual(["tea"]);
  });
});
