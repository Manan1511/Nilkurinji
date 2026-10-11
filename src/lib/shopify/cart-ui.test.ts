import { describe, expect, it } from "vitest";
import { PREVIEW_PRODUCTS } from "@/lib/shopify/preview";
import { getQuickAddVariant } from "@/lib/shopify/cart-ui";

describe("quick add eligibility", () => {
  const liveProduct = {
    ...PREVIEW_PRODUCTS[0],
    isPreview: false,
    variants: [
      {
        id: "gid://shopify/ProductVariant/first",
        title: "Sold out option",
        availableForSale: false,
        quantityAvailable: 0,
        price: { amount: "10", currencyCode: "INR" as const },
        compareAtPrice: null,
        selectedOptions: [],
        image: null,
      },
      {
        id: "gid://shopify/ProductVariant/second",
        title: "Available option",
        availableForSale: true,
        quantityAvailable: 8,
        price: { amount: "12", currencyCode: "INR" as const },
        compareAtPrice: null,
        selectedOptions: [],
        image: null,
      },
    ],
  };

  it("chooses the first available Shopify variant only after checkout is enabled", () => {
    expect(getQuickAddVariant(liveProduct, true)?.id).toBe("gid://shopify/ProductVariant/second");
    expect(getQuickAddVariant(liveProduct, false)).toBeNull();
  });

  it("never offers quick add for preview products or unavailable variants", () => {
    expect(getQuickAddVariant(PREVIEW_PRODUCTS[0], true)).toBeNull();
    expect(getQuickAddVariant({ ...liveProduct, variants: [liveProduct.variants[0]] }, true)).toBeNull();
  });
});
