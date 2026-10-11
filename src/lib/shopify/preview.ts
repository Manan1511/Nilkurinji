import { CATEGORIES } from "@/lib/site-config";
import type { StorefrontCollection, StorefrontProduct } from "@/lib/shopify/types";

const PREVIEW_IMAGE_BY_HANDLE: Record<string, { src: string; alt: string }> = {
  tea: { src: "/images/category-tea.png", alt: "Loose tea leaves in a ceramic bowl" },
  "tea-bags": { src: "/images/category-tea-bags.png", alt: "A plain tea sachet beside a cup of tea" },
  rice: { src: "/images/category-rice.png", alt: "Rice grains in a ceramic bowl" },
  snacks: { src: "/images/category-snacks.png", alt: "Golden snack bites on a ceramic plate" },
  "other-foods": { src: "/images/category-other-foods.png", alt: "Pantry ingredients arranged in ceramic bowls" },
};

export const PREVIEW_PRODUCTS: StorefrontProduct[] = CATEGORIES.map((category) => {
  const image = PREVIEW_IMAGE_BY_HANDLE[category.handle];
  return {
    id: `preview-${category.handle}`,
    handle: `preview-${category.handle}`,
    title: `Preview item · ${category.label}`,
    description: "Visual placeholder only. Approved product details will appear when products are published in Shopify.",
    productType: category.label,
    vendor: "",
    tags: [],
    featuredImage: { url: image.src, altText: image.alt, width: 1122, height: 1403 },
    images: [{ url: image.src, altText: image.alt, width: 1122, height: 1403 }],
    variants: [],
    priceRange: null,
    collectionHandles: [category.handle],
    faqs: [],
    approvedReviews: [],
    details: "",
    isPreview: true,
  };
});

export function getPreviewProduct(handle: string): StorefrontProduct | null {
  return PREVIEW_PRODUCTS.find((product) => product.handle === handle) ?? null;
}

export function getPreviewCollection(handle: string): StorefrontCollection | null {
  const category = CATEGORIES.find((item) => item.handle === handle);
  if (!category) return null;
  const product = PREVIEW_PRODUCTS.find((item) => item.collectionHandles.includes(handle));
  if (!product) return null;
  return {
    id: `preview-collection-${handle}`,
    handle,
    title: category.label,
    description: "A non-purchasable layout preview. Product information will be supplied through Shopify.",
    image: product.featuredImage,
    products: [product],
  };
}
