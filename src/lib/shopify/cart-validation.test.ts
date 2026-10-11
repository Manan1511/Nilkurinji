import { describe, expect, it } from "vitest";
import { canAddCartQuantity } from "@/lib/shopify/cart-validation";

describe("cart quantity limits", () => {
  it("limits the combined quantity of the same Shopify variant to ten", () => {
    const lines = [
      { quantity: 6, merchandise: { id: "gid://shopify/ProductVariant/tea" } },
      { quantity: 3, merchandise: { id: "gid://shopify/ProductVariant/rice" } },
    ];
    expect(canAddCartQuantity(lines, "gid://shopify/ProductVariant/tea", 4)).toBe(true);
    expect(canAddCartQuantity(lines, "gid://shopify/ProductVariant/tea", 5)).toBe(false);
    expect(canAddCartQuantity(lines, "gid://shopify/ProductVariant/new", 10)).toBe(true);
  });
});
