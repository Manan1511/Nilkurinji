import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductCard } from "@/components/product-card";
import { PREVIEW_PRODUCTS } from "@/lib/shopify/preview";

function renderCard(props: ComponentProps<typeof ProductCard>): string {
  return renderToStaticMarkup(createElement(ProductCard, props));
}

describe("preview product prices", () => {
  it("labels the reference catalog amount as a sample price", () => {
    const markup = renderCard({ product: PREVIEW_PRODUCTS[0] });

    expect(markup).toContain("Sample price:");
    expect(markup).not.toContain("wishlist");
  });

  it.each(["standard", "featured", "collection"] as const)("does not present a purchase action on a %s preview card", (variant) => {
    const markup = renderCard({ product: PREVIEW_PRODUCTS[0], variant, compactQuickAdd: true });

    expect(markup).toContain("Sample price:");
    expect(markup).not.toContain("product-card__quick-add");
    expect(markup).toContain(`/products/${PREVIEW_PRODUCTS[0].handle}`);
  });
});
