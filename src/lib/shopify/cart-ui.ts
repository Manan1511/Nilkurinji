import type { StorefrontProduct, StorefrontVariant } from "@/lib/shopify/types";

export function getQuickAddVariant(product: StorefrontProduct, purchasingEnabled: boolean): StorefrontVariant | null {
  if (!purchasingEnabled || product.isPreview || product.variants.length !== 1) return null;
  const variant = product.variants[0];
  return variant.availableForSale && variant.price.amount.trim() !== "" && Number.isFinite(Number(variant.price.amount)) && Number(variant.price.amount) >= 0 ? variant : null;
}
