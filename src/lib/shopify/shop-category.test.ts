import { describe, expect, it } from "vitest";
import { normalizeShopCategoryBanner } from "@/lib/shopify/shop-category";

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
