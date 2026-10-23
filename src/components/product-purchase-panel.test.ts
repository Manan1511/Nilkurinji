import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import * as purchasePanel from "@/components/product-purchase-panel";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import type { StorefrontProduct, StorefrontVariant } from "@/lib/shopify/types";

const price = { amount: "420.00", currencyCode: "INR" };
const variants: StorefrontVariant[] = [
  {
    id: "variant-black-25",
    title: "Black Tea / 25 bags",
    availableForSale: true,
    quantityAvailable: 8,
    price,
    compareAtPrice: null,
    selectedOptions: [{ name: "Tea", value: "Black" }, { name: "Pack", value: "25 bags" }],
    image: null,
  },
  {
    id: "variant-green-50",
    title: "Green Tea / 50 bags",
    availableForSale: false,
    quantityAvailable: 0,
    price,
    compareAtPrice: null,
    selectedOptions: [{ name: "Tea", value: "Green" }, { name: "Pack", value: "50 bags" }],
    image: null,
  },
];

const product: StorefrontProduct = {
  id: "product-tea",
  handle: "tea",
  title: "Tea",
  description: "",
  productType: "Tea",
  vendor: "",
  tags: [],
  featuredImage: null,
  images: [],
  variants,
  priceRange: { minVariantPrice: price, maxVariantPrice: price },
  collectionHandles: [],
  faqs: [],
  approvedReviews: [],
  teaProfile: null,
  details: "",
  isPreview: false,
};

const selectionHelpers = purchasePanel as unknown as {
  findSelectedVariant(variants: StorefrontVariant[], selectedOptions: Record<string, string>): StorefrontVariant | undefined;
  getPurchaseNotice(product: StorefrontProduct, purchasingEnabled: boolean, selectedVariant: StorefrontVariant | undefined): string | null;
};

describe("product option feedback", () => {
  it("explains when selected option values do not match a Shopify variant", () => {
    const nonexistentCombination = { Tea: "Green", Pack: "25 bags" };
    expect(selectionHelpers.findSelectedVariant).toBeTypeOf("function");
    expect(selectionHelpers.getPurchaseNotice).toBeTypeOf("function");
    const selectedVariant = selectionHelpers.findSelectedVariant(variants, nonexistentCombination);

    expect(selectedVariant).toBeUndefined();
    expect(selectionHelpers.getPurchaseNotice(product, true, selectedVariant)).toBe(
      "This option combination is not available. Choose another combination.",
    );
    expect(selectionHelpers.getPurchaseNotice(product, false, selectedVariant)).toBe(
      "This option combination is not available. Choose another combination.",
    );
  });

  it("keeps a real sold-out variant distinct from a nonexistent combination", () => {
    expect(selectionHelpers.findSelectedVariant).toBeTypeOf("function");
    expect(selectionHelpers.getPurchaseNotice).toBeTypeOf("function");
    const selectedVariant = selectionHelpers.findSelectedVariant(variants, { Tea: "Green", Pack: "50 bags" });
    expect(selectionHelpers.getPurchaseNotice(product, true, selectedVariant)).toBe("This option is currently unavailable.");
  });

  it("labels preview amounts as sample prices", () => {
    const previewProduct = { ...product, variants: [], isPreview: true };
    const markup = renderToStaticMarkup(createElement(ProductPurchasePanel, {
      product: previewProduct,
      purchasingEnabled: false,
    }));

    expect(markup).toContain("Sample price:");
    expect(markup).toContain("Sample prices are shown for layout review only.");
  });
});
