import { describe, expect, it } from "vitest";
import { getPreviewCollection, PREVIEW_PRODUCTS } from "@/lib/shopify/preview";

describe("reference preview catalog", () => {
  it("matches the five featured products and reference prices", () => {
    expect(PREVIEW_PRODUCTS.slice(0, 5).map((product) => [
      product.title,
      product.priceRange?.minVariantPrice.amount,
    ])).toEqual([
      ["Assam Gold Tea", "320.00"],
      ["Darjeeling Tea", "420.00"],
      ["Premium Basmati Rice", "550.00"],
      ["Premium Snacks", "180.00"],
      ["Tea Bags", "280.00"],
    ]);
  });

  it("fills tea and tea-bag collections with the reference products", () => {
    expect(getPreviewCollection("tea")?.products.map((product) => product.title)).toEqual([
      "Assam Gold Tea",
      "Darjeeling Tea",
      "Green Tea",
      "Premium Black Tea",
      "Masala Chai",
      "Jasmine Tea",
      "Earl Grey",
      "Hibiscus Tea",
    ]);
    expect(getPreviewCollection("tea-bags")?.products.map((product) => product.title)).toEqual([
      "Assam Gold Tea Bags",
      "Darjeeling Tea Bags",
      "Green Tea Bags",
    ]);
  });

  it("keeps every reference product clearly non-purchasable", () => {
    expect(PREVIEW_PRODUCTS.every((product) => product.isPreview && product.variants.length === 0)).toBe(true);
  });

  it("uses wide packshots on reference cards without replacing product gallery images", () => {
    const cardImages: Record<string, string> = {
      "assam-gold-tea": "assam-gold",
      "darjeeling-tea": "darjeeling",
      "premium-basmati-rice": "basmati",
      "premium-snacks": "snacks",
      "tea-bags-home": "tea-bags",
      "green-tea": "green-tea",
      "premium-black-tea": "premium-black-tea",
      "masala-chai": "masala-chai",
      "jasmine-tea": "jasmine-tea",
      "earl-grey": "earl-grey",
      "hibiscus-tea": "hibiscus-tea",
      "assam-gold-tea-bags": "assam-gold-tea-bags",
      "darjeeling-tea-bags": "darjeeling-tea-bags",
      "green-tea-bags": "green-tea-bags",
    };

    for (const [handle, imageName] of Object.entries(cardImages)) {
      const product = PREVIEW_PRODUCTS.find((item) => item.handle === handle);
      expect(product).toBeDefined();
      expect(Reflect.get(product!, "cardImage")).toMatchObject({
        url: `/images/preview-product-${imageName}-wide.webp`,
        width: 1586,
        height: 992,
      });
      expect(product?.featuredImage?.url).toMatch(/\.png$/);
    }
  });
});
