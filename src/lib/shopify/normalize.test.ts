import { describe, expect, it } from "vitest";
import { normalizeProduct } from "./normalize";

describe("product image fallback", () => {
  const product = { id: "1", handle: "elaichi-tea", title: "Elaichi Tea", description: "" };

  it("uses the supplied product artwork if Shopify has no image", () => {
    expect(normalizeProduct(product).featuredImage?.url).toBe("/images/client-supplied/elaichi-500g-front.webp");
  });

  it("prefers the product image managed in Shopify", () => {
    const featuredImage = { url: "https://cdn.shopify.com/product.jpg", altText: "Elaichi Tea", width: 800, height: 800 };
    expect(normalizeProduct({ ...product, featuredImage }).featuredImage).toEqual(featuredImage);
    expect(normalizeProduct({ ...product, featuredImage }).cardImage?.url).toBe("/images/client-supplied/elaichi-500g-front.webp");
  });

  it("does not assign another product's image to an unknown handle", () => {
    expect(normalizeProduct({ ...product, handle: "unknown" }).featuredImage).toBeNull();
  });

  it("matches supplied artwork to the selected pack size", () => {
    const variants = { nodes: ["500 g", "1 kg"].map((value) => ({
      id: value, title: value, availableForSale: true,
      price: { amount: "240", currencyCode: "INR" },
      selectedOptions: [{ name: "Pack size", value }],
    })) };
    const result = normalizeProduct({ ...product, variants });
    expect(result.variants[0].image?.url).toContain("elaichi-500g-front.webp");
    expect(result.variants[1].image?.url).toContain("elaichi-1kg-front.webp");
  });
});
