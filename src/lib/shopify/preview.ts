import { CATEGORIES } from "@/lib/site-config";
import type { ShopifyImage, StorefrontCollection, StorefrontProduct } from "@/lib/shopify/types";

type PreviewProductSeed = {
  handle: string;
  title: string;
  category: string;
  price: string;
  image: string;
  cardImage?: string;
  alt: string;
  collectionHandles: string[];
  tags?: string[];
};

const CATEGORY_IMAGE_BY_HANDLE: Record<string, ShopifyImage> = {
  tea: { url: "/images/category-icon-tea.png", altText: "Illustrative cutout of amber tea with loose tea leaves", width: 1254, height: 1254 },
  "tea-bags": { url: "/images/category-icon-tea-bags.png", altText: "Illustrative cutout of a tea bag with tea leaves", width: 1254, height: 1254 },
};

const PREVIEW_SEEDS: PreviewProductSeed[] = [
  {
    handle: "preview-tea-1",
    title: "Preview Tea 1",
    category: "Tea",
    price: "320.00",
    image: "/images/preview-product-assam-gold.png",
    cardImage: "/images/preview-product-assam-gold-wide.webp",
    alt: "Illustrative tea package for storefront preview",
    collectionHandles: ["tea"],
    tags: ["type:black-tea", "caffeine:caffeinated"],
  },
  {
    handle: "preview-tea-2",
    title: "Preview Tea 2",
    category: "Tea",
    price: "420.00",
    image: "/images/preview-product-darjeeling.png",
    cardImage: "/images/preview-product-darjeeling-wide.webp",
    alt: "Illustrative tea package for storefront preview",
    collectionHandles: ["tea"],
    tags: ["type:black-tea", "caffeine:caffeinated"],
  },
  {
    handle: "tea-bags-home",
    title: "Tea Bags",
    category: "Tea Bags",
    price: "280.00",
    image: "/images/preview-product-tea-bags.png",
    cardImage: "/images/preview-product-tea-bags-wide.webp",
    alt: "Illustrative tea bag package for storefront preview",
    collectionHandles: ["tea-bags"],
  },
  {
    handle: "green-tea",
    title: "Green Tea",
    category: "Tea",
    price: "350.00",
    image: "/images/preview-product-green-tea.png",
    cardImage: "/images/preview-product-green-tea-wide.webp",
    alt: "Illustrative Green Tea package for storefront preview",
    collectionHandles: ["tea"],
    tags: ["type:green-tea", "caffeine:caffeinated"],
  },
  {
    handle: "preview-black-tea",
    title: "Black Tea",
    category: "Tea",
    price: "280.00",
    image: "/images/preview-product-premium-black-tea.png",
    cardImage: "/images/preview-product-premium-black-tea-wide.webp",
    alt: "Illustrative black tea package for storefront preview",
    collectionHandles: ["tea"],
    tags: ["type:black-tea", "caffeine:caffeinated"],
  },
  {
    handle: "masala-chai",
    title: "Masala Chai",
    category: "Tea",
    price: "300.00",
    image: "/images/preview-product-masala-chai.png",
    cardImage: "/images/preview-product-masala-chai-wide.webp",
    alt: "Illustrative Masala Chai package for storefront preview",
    collectionHandles: ["tea"],
    tags: ["type:black-tea", "caffeine:caffeinated", "flavour:masala"],
  },
  {
    handle: "jasmine-tea",
    title: "Jasmine Tea",
    category: "Tea",
    price: "380.00",
    image: "/images/preview-product-jasmine-tea.png",
    cardImage: "/images/preview-product-jasmine-tea-wide.webp",
    alt: "Illustrative Jasmine Tea package for storefront preview",
    collectionHandles: ["tea"],
    tags: ["type:herbal-tea", "caffeine:caffeinated"],
  },
  {
    handle: "earl-grey",
    title: "Earl Grey",
    category: "Tea",
    price: "360.00",
    image: "/images/preview-product-earl-grey.png",
    cardImage: "/images/preview-product-earl-grey-wide.webp",
    alt: "Illustrative Earl Grey package for storefront preview",
    collectionHandles: ["tea"],
    tags: ["type:black-tea", "caffeine:caffeinated"],
  },
  {
    handle: "hibiscus-tea",
    title: "Hibiscus Tea",
    category: "Tea",
    price: "320.00",
    image: "/images/preview-product-hibiscus-tea.png",
    cardImage: "/images/preview-product-hibiscus-tea-wide.webp",
    alt: "Illustrative Hibiscus Tea package for storefront preview",
    collectionHandles: ["tea"],
    tags: ["type:fruit-infusion", "caffeine:decaf"],
  },
  {
    handle: "preview-tea-bags-1",
    title: "Preview Tea Bags 1",
    category: "Tea Bags",
    price: "320.00",
    image: "/images/preview-product-tea-bags.png",
    cardImage: "/images/preview-product-assam-gold-tea-bags-wide.webp",
    alt: "Illustrative tea bags package for storefront preview",
    collectionHandles: ["tea-bags"],
    tags: ["flavour:classic", "caffeine:caffeinated"],
  },
  {
    handle: "preview-tea-bags-2",
    title: "Preview Tea Bags 2",
    category: "Tea Bags",
    price: "420.00",
    image: "/images/preview-product-darjeeling-tea-bags.png",
    cardImage: "/images/preview-product-darjeeling-tea-bags-wide.webp",
    alt: "Illustrative tea bags package for storefront preview",
    collectionHandles: ["tea-bags"],
    tags: ["flavour:classic", "caffeine:caffeinated"],
  },
  {
    handle: "green-tea-bags",
    title: "Green Tea Bags",
    category: "Tea Bags",
    price: "350.00",
    image: "/images/preview-product-green-tea-bags.png",
    cardImage: "/images/preview-product-green-tea-bags-wide.webp",
    alt: "Illustrative Green Tea Bags package for storefront preview",
    collectionHandles: ["tea-bags"],
    tags: ["flavour:green", "caffeine:caffeinated"],
  },
];

const previewCopy = "Illustrative listing only. Product details, pack sizes and claims will be confirmed in Shopify.";

export const PREVIEW_PRODUCTS: StorefrontProduct[] = PREVIEW_SEEDS.map((seed) => {
  const image: ShopifyImage = { url: seed.image, altText: seed.alt, width: 1448, height: 1086 };
  const cardImage: ShopifyImage | null = seed.cardImage
    ? { url: seed.cardImage, altText: seed.alt, width: 1586, height: 992 }
    : null;
  const price = { amount: seed.price, currencyCode: "INR" };
  return {
    id: `preview-${seed.handle}`,
    handle: seed.handle,
    title: seed.title,
    description: previewCopy,
    productType: seed.category,
    vendor: "",
    tags: seed.tags ?? [],
    featuredImage: image,
    cardImage,
    images: [image],
    variants: [],
    priceRange: { minVariantPrice: price, maxVariantPrice: price },
    collectionHandles: seed.collectionHandles,
    faqs: [],
    approvedReviews: [],
    teaProfile: null,
    details: previewCopy,
    isPreview: true,
  };
});

export function getPreviewProduct(handle: string): StorefrontProduct | null {
  return PREVIEW_PRODUCTS.find((product) => product.handle === handle) ?? null;
}

export function getPreviewCollection(handle: string): StorefrontCollection | null {
  const category = CATEGORIES.find((item) => item.handle === handle);
  const image = CATEGORY_IMAGE_BY_HANDLE[handle];
  if (!category || !image) return null;
  const products = PREVIEW_PRODUCTS.filter((product) => product.collectionHandles.includes(handle));
  const descriptions: Record<string, string> = {
    tea: "Browse example tea products in this preview. Product details will be confirmed before publication.",
    "tea-bags": "Browse example tea bag products in this preview. Product details will be confirmed before publication.",
  };
  return {
    id: `preview-collection-${handle}`,
    handle,
    title: category.label,
    description: descriptions[handle] ?? "A non-purchasable layout preview. Product information will be supplied through Shopify.",
    image,
    products,
  };
}
