import type { ShopifyImage, StorefrontProduct, StorefrontVariant } from "@/lib/shopify/types";

export function cardAlternateImage(product: StorefrontProduct, primary: ShopifyImage | null | undefined, variant: StorefrontVariant | undefined): ShopifyImage | null {
  if (!primary) return null;
  const option = variant?.selectedOptions.find((item) => /pack|size|weight/i.test(item.name))?.value.toLowerCase().replace(/\s+/g, "");
  const size = option === "500g" || option === "0.5kg" ? "500g" : option === "1kg" || option === "1000g" ? "1kg" : null;
  const prefix: Record<string, string> = { "premium-tea": "classic", "rose-tea": "rose", "elaichi-tea": "elaichi" };
  if (size && prefix[product.handle]) {
    const url = `/images/client-supplied/${prefix[product.handle]}-${size}-card-alt.webp`;
    if (url !== primary.url) return { url, altText: `${product.title}, ${size === "500g" ? "500 g" : "1 kg"}, alternate view`, width: 1200, height: 900 };
  }
  const otherVariantImages = new Set(product.variants.filter((item) => item.id !== variant?.id).map((item) => item.image?.url).filter(Boolean));
  return product.images.find((candidate) => {
    if (candidate.url === primary.url || candidate.url.includes("/campaign-") || otherVariantImages.has(candidate.url)) return false;
    const text = `${candidate.url} ${candidate.altText ?? ""}`.toLowerCase().replace(/\s+/g, "");
    if (size === "500g" && /1kg|1000g/.test(text) && !/500g|0\.5kg/.test(text)) return false;
    if (size === "1kg" && /500g|0\.5kg/.test(text) && !/1kg|1000g/.test(text)) return false;
    if (product.variants.length <= 1) return true;
    return size === "500g" ? /500g|0\.5kg/.test(text) && !/1kg|1000g/.test(text)
      : size === "1kg" ? /1kg|1000g/.test(text) && !/500g|0\.5kg/.test(text) : false;
  }) ?? null;
}
