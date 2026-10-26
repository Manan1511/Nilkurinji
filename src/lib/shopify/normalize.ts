import { parseApprovedReviews, parseFaqs } from "@/lib/shopify/product-content";
import type { ShopifyImage, ShopifyMoney, StorefrontProduct } from "@/lib/shopify/types";
import { parseTeaProfile } from "@/lib/shopify/tea-profile";

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

export function normalizeProduct(raw: RawProduct): StorefrontProduct {
  const variants = raw.variants?.nodes ?? [];
  const images = raw.images?.nodes?.length ? raw.images.nodes : raw.featuredImage ? [raw.featuredImage] : [];
  const minVariantPrice = raw.priceRange?.minVariantPrice ?? variants[0]?.price ?? null;
  const maxVariantPrice = raw.priceRange?.maxVariantPrice ?? minVariantPrice;

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
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
    collectionHandles: raw.collections?.nodes?.map(({ handle }) => handle) ?? [],
    faqs: parseFaqs(raw.faqs?.value),
    approvedReviews: parseApprovedReviews(raw.reviews?.value),
    teaProfile: parseTeaProfile(raw.teaProfile?.value),
    howItsMade: parseApprovedHowItsMade(raw.howItsMade?.value, raw.howItsMadeApproved?.value),
    details: raw.details?.value?.trim() ?? "",
    isPreview: false,
  };
}
