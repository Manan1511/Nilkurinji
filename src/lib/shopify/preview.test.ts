import { describe, expect, it } from "vitest";
import { getPreviewCollection, getPreviewProduct, PREVIEW_PRODUCTS } from "@/lib/shopify/preview";

describe("reference preview catalog", () => {
  it("covers every approved shop category and uses INR sample prices", () => {
    expect(PREVIEW_PRODUCTS.length).toBeGreaterThan(0);
    const categories = ["tea", "tea-bags", "rice", "snacks", "other-foods"];
    expect(PREVIEW_PRODUCTS.every((product) => product.collectionHandles.length > 0 && product.collectionHandles.every((handle) => categories.includes(handle)))).toBe(true);
    expect(categories.every((category) => PREVIEW_PRODUCTS.some((product) => product.collectionHandles.includes(category)))).toBe(true);
    expect(PREVIEW_PRODUCTS.every((product) => product.priceRange?.minVariantPrice.currencyCode === "INR")).toBe(true);
    expect(getPreviewProduct("preview-basmati-rice")?.isPreview).toBe(true);
    expect(getPreviewProduct("preview-pantry-snacks")?.isPreview).toBe(true);
  });

  it("fills tea and tea-bag collections with the reference products", () => {
    expect(getPreviewCollection("tea")?.products.map((product) => product.title)).toEqual([
      "Preview Tea 1",
      "Preview Tea 2",
      "Green Tea",
      "Black Tea",
      "Masala Chai",
      "Jasmine Tea",
      "Earl Grey",
      "Hibiscus Tea",
    ]);
    expect(getPreviewCollection("tea-bags")?.products.map((product) => product.title)).toEqual([
      "Tea Bags",
      "Preview Tea Bags 1",
      "Preview Tea Bags 2",
      "Green Tea Bags",
    ]);
  });

  it("keeps every reference product clearly non-purchasable", () => {
    expect(PREVIEW_PRODUCTS.every((product) => product.isPreview && product.variants.length === 0)).toBe(true);
  });

  it("keeps preview product and collection copy neutral until product facts are approved", () => {
    const productCopy = PREVIEW_PRODUCTS.flatMap((product) => [product.title, product.description, product.details]).join(" ");
    const collectionCopy = [getPreviewCollection("tea")?.description, getPreviewCollection("tea-bags")?.description].join(" ");
    const unsupportedClaims = /premium|exquisitely|naturally calming|handcrafted|finest leaves|enriching experience|pure ingredients|same rich flavours/i;

    expect(productCopy).not.toMatch(unsupportedClaims);
    expect(collectionCopy).not.toMatch(unsupportedClaims);
    expect(PREVIEW_PRODUCTS.every((product) => product.description === product.details)).toBe(true);
  });

  it("does not expose unapproved origin names in preview titles, handles, or image text", () => {
    const productIdentity = PREVIEW_PRODUCTS.flatMap((product) => [
      product.title,
      product.handle,
      product.featuredImage?.altText ?? "",
    ]).join(" ");

    expect(productIdentity).not.toMatch(/\b(assam|darjeeling|premium)\b/i);
  });

  it("uses wide packshots on reference cards without replacing product gallery images", () => {
    const cardImages: Record<string, string> = {
      "preview-tea-1": "assam-gold",
      "preview-tea-2": "darjeeling",
      "tea-bags-home": "tea-bags",
      "green-tea": "green-tea",
      "preview-black-tea": "premium-black-tea",
      "masala-chai": "masala-chai",
      "jasmine-tea": "jasmine-tea",
      "earl-grey": "earl-grey",
      "hibiscus-tea": "hibiscus-tea",
      "preview-tea-bags-1": "assam-gold-tea-bags",
      "preview-tea-bags-2": "darjeeling-tea-bags",
      "green-tea-bags": "green-tea-bags",
    };

    for (const [handle, imageName] of Object.entries(cardImages)) {
      const product = PREVIEW_PRODUCTS.find((item) => item.handle === handle);
      const hasKurinjiBrandBlossoms = !["jasmine-tea", "hibiscus-tea"].includes(handle);
      const flowerSuffix = hasKurinjiBrandBlossoms ? "-kurinji" : "";
      expect(product).toBeDefined();
      expect(Reflect.get(product!, "cardImage")).toMatchObject({
        url: `/images/preview-product-${imageName}-wide${flowerSuffix}.webp`,
        width: 1586,
        height: 992,
      });
      expect(product?.featuredImage?.url).toMatch(/\.png$/);
      if (hasKurinjiBrandBlossoms) {
        expect(product?.featuredImage?.url).toContain("-kurinji.png");
      }
    }
  });
});
