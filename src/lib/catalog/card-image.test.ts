import { describe, expect, it } from "vitest";
import { normalizeProduct } from "@/lib/shopify/normalize";
import { cardAlternateImage } from "./card-image";

const variants = { nodes: ["500 g", "1 kg"].map((value) => ({ id: value, title: value, availableForSale: true, price: { amount: "240", currencyCode: "INR" }, selectedOptions: [{ name: "Pack size", value }] })) };

describe("card alternate images", () => {
  it.each([["premium-tea", "classic"], ["rose-tea", "rose"], ["elaichi-tea", "elaichi"]])("uses %s alternate artwork for the selected pack", (handle, name) => {
    const product = normalizeProduct({ id: "1", handle, title: "Tea", description: "", variants });
    expect(cardAlternateImage(product, product.variants[0].image, product.variants[0])?.url).toContain(`${name}-500g-card-alt.webp`);
    expect(cardAlternateImage(product, product.variants[1].image, product.variants[1])?.url).toContain(`${name}-1kg-card-alt.webp`);
    expect(product.images.map((image) => image.url)).toContain(`/images/client-supplied/${name}-500g-card-alt.webp`);
    expect(product.images.map((image) => image.url)).toContain(`/images/client-supplied/${name}-1kg-card-alt.webp`);
  });

  it("does not use shared campaign images or another pack as an alternate", () => {
    const first = { url: "/500g.webp", altText: "500 g", width: 100, height: 100 };
    const other = { url: "/1kg.webp", altText: "1 kg", width: 100, height: 100 };
    const product = normalizeProduct({ id: "1", handle: "unknown", title: "Tea", description: "", featuredImage: first, images: { nodes: [first, other] }, variants });
    expect(cardAlternateImage(product, first, product.variants[0])).toBeNull();
  });
});
