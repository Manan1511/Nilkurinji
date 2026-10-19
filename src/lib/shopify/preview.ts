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
  description?: string;
  tags?: string[];
};

const CATEGORY_IMAGE_BY_HANDLE: Record<string, ShopifyImage> = {
  tea: { url: "/images/category-tea.png", altText: "Loose tea leaves in a ceramic bowl", width: 1122, height: 1403 },
  "tea-bags": { url: "/images/category-tea-bags.png", altText: "A plain tea sachet beside a cup of tea", width: 1122, height: 1403 },
  rice: { url: "/images/category-rice.png", altText: "Rice grains in a ceramic bowl", width: 1122, height: 1403 },
  snacks: { url: "/images/category-snacks.png", altText: "Golden snack bites on a ceramic plate", width: 1122, height: 1403 },
  "other-foods": { url: "/images/category-other-foods.png", altText: "Pantry ingredients arranged in ceramic bowls", width: 1122, height: 1403 },
};

const PREVIEW_SEEDS: PreviewProductSeed[] = [
  {
    handle: "assam-gold-tea",
    title: "Assam Gold Tea",
    category: "Tea",
    price: "320.00",
    image: "/images/preview-product-assam-gold.png",
    cardImage: "/images/preview-product-assam-gold-wide.webp",
    alt: "Illustrative Assam Gold Tea package for storefront preview",
    collectionHandles: ["tea"],
    description: "Bold, malty and full of character.",
    tags: ["type:black-tea", "caffeine:caffeinated"],
  },
  {
    handle: "darjeeling-tea",
    title: "Darjeeling Tea",
    category: "Tea",
    price: "420.00",
    image: "/images/preview-product-darjeeling.png",
    cardImage: "/images/preview-product-darjeeling-wide.webp",
    alt: "Illustrative Darjeeling Tea package for storefront preview",
    collectionHandles: ["tea"],
    description: "Light, floral and exquisitely smooth.",
    tags: ["type:black-tea", "caffeine:caffeinated"],
  },
  {
    handle: "premium-basmati-rice",
    title: "Premium Basmati Rice",
    category: "Rice",
    price: "550.00",
    image: "/images/preview-product-basmati.png",
    cardImage: "/images/preview-product-basmati-wide.webp",
    alt: "Illustrative basmati rice package for storefront preview",
    collectionHandles: ["rice"],
  },
  {
    handle: "premium-snacks",
    title: "Premium Snacks",
    category: "Snacks",
    price: "180.00",
    image: "/images/preview-product-snacks.png",
    cardImage: "/images/preview-product-snacks-wide.webp",
    alt: "Illustrative snack package for storefront preview",
    collectionHandles: ["snacks"],
  },
  {
    handle: "tea-bags-home",
    title: "Tea Bags",
    category: "Tea Bags",
    price: "280.00",
    image: "/images/preview-product-tea-bags.png",
    cardImage: "/images/preview-product-tea-bags-wide.webp",
    alt: "Illustrative tea bag package for storefront preview",
    collectionHandles: [],
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
    description: "Fresh, clean and naturally calming.",
    tags: ["type:green-tea", "caffeine:caffeinated"],
  },
  {
    handle: "premium-black-tea",
    title: "Premium Black Tea",
    category: "Tea",
    price: "280.00",
    image: "/images/preview-product-premium-black-tea.png",
    cardImage: "/images/preview-product-premium-black-tea-wide.webp",
    alt: "Illustrative Premium Black Tea package for storefront preview",
    collectionHandles: ["tea"],
    description: "Rich, smooth and timeless.",
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
    description: "A traditional blend with a spicy kick.",
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
    description: "Fragrant, delicate and soothing.",
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
    description: "Citrus notes with a smooth finish.",
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
    description: "Tangy, vibrant and refreshing.",
    tags: ["type:fruit-infusion", "caffeine:decaf"],
  },
  {
    handle: "assam-gold-tea-bags",
    title: "Assam Gold Tea Bags",
    category: "Tea Bags",
    price: "320.00",
    image: "/images/preview-product-tea-bags.png",
    cardImage: "/images/preview-product-assam-gold-tea-bags-wide.webp",
    alt: "Illustrative Assam Gold Tea Bags package for storefront preview",
    collectionHandles: ["tea-bags"],
    description: "Bold, malty and full of character.",
    tags: ["flavour:classic", "caffeine:caffeinated"],
  },
  {
    handle: "darjeeling-tea-bags",
    title: "Darjeeling Tea Bags",
    category: "Tea Bags",
    price: "420.00",
    image: "/images/preview-product-darjeeling-tea-bags.png",
    cardImage: "/images/preview-product-darjeeling-tea-bags-wide.webp",
    alt: "Illustrative Darjeeling Tea Bags package for storefront preview",
    collectionHandles: ["tea-bags"],
    description: "Light, floral and exquisitely smooth.",
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
    description: "Fresh, clean and naturally calming.",
    tags: ["flavour:green", "caffeine:caffeinated"],
  },
];

const previewCopy = "Preview listing only. Confirm product details, pack size, sourcing and any claims in Shopify before publication.";

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
    description: seed.description ?? previewCopy,
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
    tea: "From classic blends to rare infusions, discover our handcrafted teas made from the finest leaves, for a truly enriching experience.",
    "tea-bags": "Convenience meets tradition. Our tea bags bring you the same rich flavours and pure ingredients, in every cup.",
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
