import type { StorefrontProduct, StorefrontVariant } from "@/lib/shopify/types";

export function getQuickAddVariant(product: StorefrontProduct, purchasingEnabled: boolean): StorefrontVariant | null {
  if (!purchasingEnabled || product.isPreview) return null;
  return product.variants.find((variant) => variant.availableForSale) ?? null;
}
