import type { StorefrontVariant } from "@/lib/shopify/types";

export function defaultVariant(variants: StorefrontVariant[], requestedId?: string): StorefrontVariant | undefined {
  if (requestedId) {
    const requested = variants.find((variant) => variant.id === requestedId || variant.id.split("/").at(-1) === requestedId);
    if (requested) return requested;
  }
  return variants.find((variant) => variant.availableForSale && variant.selectedOptions.some((option) => /pack|size|weight/i.test(option.name) && /^(500g|0\.5kg)$/i.test(option.value.replace(/\s+/g, ""))))
    ?? variants.find((variant) => variant.availableForSale)
    ?? variants[0];
}
