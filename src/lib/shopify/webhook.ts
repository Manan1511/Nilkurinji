import { createHmac, timingSafeEqual } from "node:crypto";

const CATEGORIES = ["tea", "tea-bags", "rice", "snacks", "other-foods"] as const;
const EDITORIAL = ["tea-guide", "recipes", "journal"] as const;

const PRODUCT_TAGS = [
  "shopify-products",
  "shopify-search",
  "shopify-homepage",
  "shopify-collection-shop-all",
  ...CATEGORIES.flatMap((handle) => [`shopify-collection-${handle}`, `shopify-category-${handle}`]),
];

const PUBLIC_CONTENT_TAGS = [
  "shopify-homepage",
  "shopify-policies",
  "shopify-page-about",
  "shopify-page-contact",
  "shopify-page-our-story",
  "shopify-page-shipping-and-returns",
  ...EDITORIAL.map((handle) => `shopify-blog-${handle}`),
  ...CATEGORIES.map((handle) => `shopify-category-${handle}`),
];

const PRODUCT_TOPICS = new Set([
  "products/create",
  "products/update",
  "products/delete",
  "product_publications/update",
  "inventory_levels/update",
]);
const COLLECTION_TOPICS = new Set(["collections/create", "collections/update", "collections/delete"]);
const CONTENT_TOPICS = new Set([
  "metaobjects/create",
  "metaobjects/update",
  "metaobjects/delete",
  "metafields/create",
  "metafields/update",
  "metafields/delete",
]);

export function verifyShopifyWebhookSignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature || secret.trim().length < 16 || !/^[A-Za-z0-9+/]{43}=$/.test(signature)) return false;
  const expected = createHmac("sha256", secret.trim()).update(body).digest();
  const received = Buffer.from(signature, "base64");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function getShopifyWebhookTags(topic: string): string[] | null {
  if (PRODUCT_TOPICS.has(topic)) return [...PRODUCT_TAGS];
  if (COLLECTION_TOPICS.has(topic)) return [...new Set([...PRODUCT_TAGS, ...CATEGORIES.map((handle) => `shopify-collection-${handle}`)])];
  if (CONTENT_TOPICS.has(topic)) return [...new Set([...PUBLIC_CONTENT_TAGS, ...PRODUCT_TAGS])];
  return null;
}

export function normalizeShopifyDomain(value: string | null): string | null {
  const domain = value?.trim().toLowerCase() ?? "";
  return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.myshopify\.com$/.test(domain) ? domain : null;
}
