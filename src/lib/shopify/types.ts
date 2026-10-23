import type { ProductFaq } from "@/lib/shopify/product-content";

export type ShopifyMoney = { amount: string; currencyCode: string };

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type StorefrontVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
};

export type ApprovedProductReview = {
  name: string;
  rating: number;
  title: string;
  body: string;
  date: string | null;
};

export type TeaProfileFormat = "loose-tea" | "tea-bag";
export type TeaProfile = {
  approved: true;
  format: TeaProfileFormat | null;
  origin: string | null;
  estate: string | null;
  elevationM: number | null;
  harvest: string | null;
  lot: string | null;
  tastingNotes: string[];
  brewing: {
    dose: { amount: number; unit: "g" | "bag" } | null;
    waterMl: number | null;
    temperatureC: number | null;
    steepSeconds: number | null;
    infusions: number | null;
    instructions: string | null;
  } | null;
};

export type StorefrontProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  featuredImage: ShopifyImage | null;
  cardImage?: ShopifyImage | null;
  images: ShopifyImage[];
  variants: StorefrontVariant[];
  priceRange: { minVariantPrice: ShopifyMoney; maxVariantPrice: ShopifyMoney } | null;
  collectionHandles: string[];
  faqs: ProductFaq[];
  approvedReviews: ApprovedProductReview[];
  teaProfile: TeaProfile | null;
  details: string;
  isPreview: boolean;
}

export type StorefrontCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: StorefrontProduct[];
};

export type StorefrontData<T> =
  | { source: "preview" | "shopify"; data: T }
  | { source: "unavailable"; data: null; reason: string };

export type ShopifyPolicy = {
  id: string;
  title: string;
  handle: string;
  body: string;
  url: string | null;
};

export type ShopifyPage = {
  id: string;
  title: string;
  handle: string;
  body: string;
  seo: { title: string | null; description: string | null } | null;
};
