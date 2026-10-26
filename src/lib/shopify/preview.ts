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
  tea: { url: "/images/category-tea.png", altText: "Illustrative tea and tea leaves in a warm garden setting", width: 1254, height: 1254 },
  "tea-bags": { url: "/images/category-tea-bags-kurinji.webp", altText: "Illustrative tea bag and cup with blue-purple Neelakurinji blossoms", width: 1122, height: 1402 },
  rice: { url: "/images/category-rice.png", altText: "Illustrative bowl of rice in a warm garden setting", width: 1254, height: 1254 },
  snacks: { url: "/images/category-snacks.png", altText: "Illustrative bowl of pantry snacks in a warm garden setting", width: 1254, height: 1254 },
  "other-foods": { url: "/images/category-other-foods.png", altText: "Illustrative selection of pantry foods in a warm garden setting", width: 1254, height: 1254 },
};

const PREVIEW_SEEDS: PreviewProductSeed[] = [
  {
    handle: "preview-tea-1",
    title: "Preview Tea 1",
    category: "Tea",
    price: "320.00",
    image: "/images/preview-product-assam-gold-kurinji.png",
    cardImage: "/images/preview-product-assam-gold-wide-kurinji.webp",
    alt: "Illustrative tea package for storefront preview",
    collectionHandles: ["tea"],
    tags: ["type:black-tea", "caffeine:caffeinated"],
  },
  {
    handle: "preview-tea-2",
    title: "Preview Tea 2",
    category: "Tea",
    price: "420.00",
    image: "/images/preview-product-darjeeling-kurinji.png",
    cardImage: "/images/preview-product-darjeeling-wide-kurinji.webp",
    alt: "Illustrative tea package for storefront preview",
    collectionHandles: ["tea"],
    tags: ["type:black-tea", "caffeine:caffeinated"],
  },
  {
    handle: "tea-bags-home",
    title: "Tea Bags",
    category: "Tea Bags",
    price: "280.00",
    image: "/images/preview-product-tea-bags-kurinji.png",
    cardImage: "/images/preview-product-tea-bags-wide-kurinji.webp",
    alt: "Illustrative tea bag package for storefront preview",
    collectionHandles: ["tea-bags"],
  },
  {
    handle: "green-tea",
    title: "Green Tea",
    category: "Tea",
    price: "350.00",
    image: "/images/preview-product-green-tea-kurinji.png",
    cardImage: "/images/preview-product-green-tea-wide-kurinji.webp",
    alt: "Illustrative Green Tea package for storefront preview",
    collectionHandles: ["tea"],
    tags: ["type:green-tea", "caffeine:caffeinated"],
  },
  {
    handle: "preview-black-tea",
    title: "Black Tea",
    category: "Tea",
    price: "280.00",
    image: "/images/preview-product-premium-black-tea-kurinji.png",
    cardImage: "/images/preview-product-premium-black-tea-wide-kurinji.webp",
    alt: "Illustrative black tea package for storefront preview",
    collectionHandles: ["tea"],
    tags: ["type:black-tea", "caffeine:caffeinated"],
  },
  {
    handle: "masala-chai",
    title: "Masala Chai",
    category: "Tea",
    price: "300.00",
    image: "/images/preview-product-masala-chai-kurinji.png",
    cardImage: "/images/preview-product-masala-chai-wide-kurinji.webp",
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
    image: "/images/preview-product-earl-grey-kurinji.png",
    cardImage: "/images/preview-product-earl-grey-wide-kurinji.webp",
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
    image: "/images/preview-product-tea-bags-kurinji.png",
    cardImage: "/images/preview-product-assam-gold-tea-bags-wide-kurinji.webp",
    alt: "Illustrative tea bags package for storefront preview",
    collectionHandles: ["tea-bags"],
    tags: ["flavour:classic", "caffeine:caffeinated"],
  },
  {
    handle: "preview-tea-bags-2",
    title: "Preview Tea Bags 2",
    category: "Tea Bags",
    price: "420.00",
    image: "/images/preview-product-darjeeling-tea-bags-kurinji.png",
    cardImage: "/images/preview-product-darjeeling-tea-bags-wide-kurinji.webp",
    alt: "Illustrative tea bags package for storefront preview",
    collectionHandles: ["tea-bags"],
    tags: ["flavour:classic", "caffeine:caffeinated"],
  },
  {
    handle: "green-tea-bags",
    title: "Green Tea Bags",
    category: "Tea Bags",
    price: "350.00",
    image: "/images/preview-product-green-tea-bags-kurinji.png",
    cardImage: "/images/preview-product-green-tea-bags-wide-kurinji.webp",
    alt: "Illustrative Green Tea Bags package for storefront preview",
    collectionHandles: ["tea-bags"],
    tags: ["flavour:green", "caffeine:caffeinated"],
  },
  {
    handle: "preview-basmati-rice",
    title: "Basmati Rice Preview",
    category: "Rice",
    price: "550.00",
    image: "/images/preview-product-basmati.png",
    cardImage: "/images/preview-product-basmati-wide.webp",
    alt: "Illustrative concept packaging for basmati rice",
    collectionHandles: ["rice"],
    tags: [],
  },
  {
    handle: "preview-pantry-snacks",
    title: "Pantry Snacks Preview",
    category: "Snacks",
    price: "180.00",
    image: "/images/preview-product-snacks.png",
    cardImage: "/images/preview-product-snacks-wide.webp",
    alt: "Illustrative concept packaging for pantry snacks",
    collectionHandles: ["snacks"],
    tags: [],
  },
  {
    handle: "preview-other-foods",
    title: "Other Foods Preview",
    category: "Other Foods",
    price: "240.00",
    image: "/images/category-other-foods.png",
    alt: "Illustrative concept imagery for other pantry foods",
    collectionHandles: ["other-foods"],
    tags: [],
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
    howItsMade: null,
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
    rice: "Illustrative rice products. Final varieties, pack sizes and prices will come from Shopify.",
    snacks: "Illustrative snack products. Final ingredients, pack sizes and prices will come from Shopify.",
    "other-foods": "Illustrative pantry products. Final product information will come from Shopify.",
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
