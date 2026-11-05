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
  "premium-tea": [
    { url: "/images/client-supplied/classic-500g-front.webp", altText: "Nilkurinji Premium Classic Tea, 500 g pack artwork", width: 1448, height: 1086 },
    { url: "/images/client-supplied/classic-1kg-front.webp", altText: "Nilkurinji Premium Classic Tea, 1 kg pack artwork", width: 1448, height: 1086 },
    { url: "/images/client-supplied/classic-500g-card-alt.webp", altText: "Nilkurinji Premium Classic Tea, 500 g alternate artwork", width: 1200, height: 900 },
    { url: "/images/client-supplied/classic-1kg-card-alt.webp", altText: "Nilkurinji Premium Classic Tea, 1 kg alternate artwork", width: 1200, height: 900 },
    { url: "/images/client-supplied/premium-tea-1kg-back-label.jpg", altText: "Back label of Nilkurinji Premium Tea, 1 kg", width: 1448, height: 1086 },
  ],
  "rose-tea": [
    { url: "/images/client-supplied/rose-500g-front.webp", altText: "Nilkurinji Premium Rose Tea, 500 g pack artwork", width: 1448, height: 1086 },
    { url: "/images/client-supplied/rose-1kg-front.webp", altText: "Nilkurinji Premium Rose Tea, 1 kg pack artwork", width: 1448, height: 1086 },
    { url: "/images/client-supplied/rose-500g-card-alt.webp", altText: "Nilkurinji Premium Rose Tea, 500 g alternate artwork", width: 1200, height: 900 },
    { url: "/images/client-supplied/rose-1kg-card-alt.webp", altText: "Nilkurinji Premium Rose Tea, 1 kg alternate artwork", width: 1200, height: 900 },
  ],
  "elaichi-tea": [
    { url: "/images/client-supplied/elaichi-500g-front.webp", altText: "Nilkurinji Premium Elaichi Tea, 500 g pack artwork", width: 1448, height: 1086 },
    { url: "/images/client-supplied/elaichi-1kg-front.webp", altText: "Nilkurinji Premium Elaichi Tea, 1 kg pack artwork", width: 1448, height: 1086 },
    { url: "/images/client-supplied/elaichi-500g-card-alt.webp", altText: "Nilkurinji Premium Elaichi Tea, 500 g alternate artwork", width: 1200, height: 900 },
    { url: "/images/client-supplied/elaichi-1kg-card-alt.webp", altText: "Nilkurinji Premium Elaichi Tea, 1 kg alternate artwork", width: 1200, height: 900 },
  ],
};

const SHARED_PRODUCT_IMAGES: ShopifyImage[] = [
  { url: "/images/client-supplied/campaign-0290.webp", altText: "Tea leaves being poured into a pan", width: 1448, height: 1086 },
  { url: "/images/client-supplied/campaign-0291.webp", altText: "Tea being poured into a cup", width: 1448, height: 1086 },
  { url: "/images/client-supplied/campaign-0292.webp", altText: "A woman enjoying a cup of tea", width: 1448, height: 1086 },
];

function uniqueImages(images: Array<ShopifyImage | null | undefined>): ShopifyImage[] {
  const seen = new Set<string>();
  return images.filter((image): image is ShopifyImage => {
    if (!image || seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
}

function suppliedVariantImage(handle: string, options: { name: string; value: string }[] | null | undefined): ShopifyImage | null {
  const pack = options?.find((option) => /pack|size|weight/i.test(option.name))?.value.trim().toLowerCase().replace(/\s+/g, "");
  const size = pack === "500g" || pack === "0.5kg" ? "500g" : pack === "1kg" || pack === "1000g" ? "1kg" : null;
  const prefix: Record<string, string> = { "premium-tea": "classic", "rose-tea": "rose", "elaichi-tea": "elaichi" };
  if (!size || !prefix[handle]) return null;
  return CLIENT_PRODUCT_IMAGES[handle]?.find((image) => image.url.endsWith(`/${prefix[handle]}-${size}-front.webp`)) ?? null;
}

export function normalizeProduct(raw: RawProduct): StorefrontProduct {
  const variants = raw.variants?.nodes ?? [];
  const shopifyImages = uniqueImages([raw.featuredImage, ...(raw.images?.nodes ?? []), ...variants.map((variant) => variant.image)]);
  const images = uniqueImages([...shopifyImages, ...(CLIENT_PRODUCT_IMAGES[raw.handle] ?? []), ...SHARED_PRODUCT_IMAGES]);
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
    featuredImage: raw.featuredImage ?? shopifyImages[0] ?? CLIENT_PRODUCT_IMAGES[raw.handle]?.[0] ?? null,
    ...(raw.handle === "elaichi-tea" ? { cardImage: CLIENT_PRODUCT_IMAGES[raw.handle][0] } : {}),
    images,
    variants: variants.map((variant) => ({
      ...variant,
      compareAtPrice: variant.compareAtPrice ?? null,
      selectedOptions: variant.selectedOptions ?? [],
      image: variant.image ?? suppliedVariantImage(raw.handle, variant.selectedOptions),
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
