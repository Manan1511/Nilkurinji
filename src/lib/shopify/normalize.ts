import { parseApprovedReviews, parseFaqs } from "@/lib/shopify/product-content";
import type { ShopifyImage, ShopifyMoney, StorefrontProduct } from "@/lib/shopify/types";
import { parseTeaProfile } from "@/lib/shopify/tea-profile";
import { getProductPresentation } from "@/lib/product-presentation";

type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType?: string | null;
  vendor?: string | null;
  tags?: string[] | null;
  featuredImage?: ShopifyImage | null;
  images?: { nodes?: ShopifyImage[] | null } | null;
  priceRange?: { minVariantPrice?: ShopifyMoney | null; maxVariantPrice?: ShopifyMoney | null } | null;
  variants?: { nodes?: Array<{
    id: string;
    title: string;
    availableForSale: boolean;
    quantityAvailable?: number | null;
    price: ShopifyMoney;
    compareAtPrice?: ShopifyMoney | null;
    selectedOptions?: { name: string; value: string }[] | null;
    image?: ShopifyImage | null;
  }> | null } | null;
  collections?: { nodes?: { handle: string }[] | null } | null;
  details?: { value?: string | null } | null;
  faqs?: { value?: string | null } | null;
  reviews?: { value?: string | null } | null;
  teaProfile?: { value?: string | null } | null;
  howItsMade?: { value?: string | null } | null;
  howItsMadeApproved?: { value?: string | null } | null;
};

function parseApprovedHowItsMade(content: string | null | undefined, approved: string | null | undefined): string | null {
  if (approved?.trim().toLowerCase() !== "true") return null;
  const text = content?.replace(/\r\n?/g, "\n").trim();
  if (!text || text.length > 2400 || /<\/?[a-z][^>]*>/i.test(text)) return null;
  return text;
}

const CLIENT_PRODUCT_IMAGES: Record<string, ShopifyImage[]> = {
  "premium-tea": [{ url: "/images/client-supplied/premium-tea-1kg-back-label.jpg", altText: "Back label of Nilkurinji Premium Tea, 1 kg", width: 1448, height: 1086 }],
  "rose-tea": [{ url: "/images/client-supplied/rose-tea-campaign.jpg", altText: "Nilkurinji Rose Tea, 500 g, in a campaign image", width: 1448, height: 1086 }],
  "elaichi-tea": [
    { url: "/images/client-supplied/elaichi-tea-500g-pack.jpg", altText: "Nilkurinji Elaichi Tea, 500 g pack", width: 1448, height: 1086 },
    { url: "/images/client-supplied/elaichi-tea-500g-pack-alt.jpg", altText: "Alternate view of Nilkurinji Elaichi Tea, 500 g pack", width: 1448, height: 1086 },
  ],
};

function uniqueImages(images: Array<ShopifyImage | null | undefined>): ShopifyImage[] {
  const seen = new Set<string>();
  return images.filter((image): image is ShopifyImage => {
    if (!image || seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
}

export function normalizeProduct(raw: RawProduct): StorefrontProduct {
  const variants = raw.variants?.nodes ?? [];
  const shopifyImages = uniqueImages([raw.featuredImage, ...(raw.images?.nodes ?? []), ...variants.map((variant) => variant.image)]);
  const images = shopifyImages.length ? shopifyImages : CLIENT_PRODUCT_IMAGES[raw.handle] ?? [];
  const minVariantPrice = raw.priceRange?.minVariantPrice ?? variants[0]?.price ?? null;
  const maxVariantPrice = raw.priceRange?.maxVariantPrice ?? minVariantPrice;
  const collectionHandles = raw.collections?.nodes?.map(({ handle }) => handle) ?? [];
  // Imported products may have a Shopify product type before category collections are configured.
  if (raw.productType?.trim().toLowerCase() === "tea" && !collectionHandles.some((handle) => handle === "tea" || handle === "tea-bags")) {
    collectionHandles.push("tea");
  }
  const presentation = getProductPresentation({
    handle: raw.handle,
    title: raw.title,
    productType: raw.productType ?? "",
    tags: raw.tags ?? [],
    collectionHandles,
  });

  return {
    id: raw.id,
    handle: raw.handle,
    title: presentation.title,
    description: raw.description ?? "",
    productType: raw.productType ?? "",
    vendor: raw.vendor ?? "",
    tags: raw.tags ?? [],
    featuredImage: raw.featuredImage ?? images[0] ?? null,
    images,
    variants: variants.map((variant) => ({
      ...variant,
      compareAtPrice: variant.compareAtPrice ?? null,
      selectedOptions: variant.selectedOptions ?? [],
      image: variant.image ?? null,
      quantityAvailable: variant.quantityAvailable ?? null,
    })),
    priceRange: minVariantPrice && maxVariantPrice ? { minVariantPrice, maxVariantPrice } : null,
    collectionHandles,
    faqs: parseFaqs(raw.faqs?.value),
    approvedReviews: parseApprovedReviews(raw.reviews?.value),
    teaProfile: parseTeaProfile(raw.teaProfile?.value),
    howItsMade: parseApprovedHowItsMade(raw.howItsMade?.value, raw.howItsMadeApproved?.value),
    comingSoon: presentation.comingSoon,
    details: raw.details?.value?.trim() ?? "",
    isPreview: false,
  };
}
