import { describe, expect, it } from "vitest";
import { normalizeProduct } from "./normalize";

describe("product image fallback", () => {
  const product = { id: "1", handle: "elaichi-tea", title: "Elaichi Tea", description: "" };

  it("uses the supplied product artwork if Shopify has no image", () => {
    expect(normalizeProduct(product).featuredImage?.url).toBe("/images/client-supplied/elaichi-tea-500g-pack.jpg");
  });

  it("prefers the product image managed in Shopify", () => {
    const featuredImage = { url: "https://cdn.shopify.com/product.jpg", altText: "Elaichi Tea", width: 800, height: 800 };
    expect(normalizeProduct({ ...product, featuredImage }).featuredImage).toEqual(featuredImage);
  });

  it("does not assign another product's image to an unknown handle", () => {
    expect(normalizeProduct({ ...product, handle: "unknown" }).featuredImage).toBeNull();
  });
});
