import type { StorefrontProduct, StorefrontVariant } from "@/lib/shopify/types";
import type { ShopifyCart } from "@/lib/shopify/cart";

export function makeVariant(overrides: Partial<StorefrontVariant> = {}): StorefrontVariant {
  return { id: "gid://shopify/ProductVariant/101", title: "100 g", availableForSale: true, quantityAvailable: 5, price: { amount: "320.00", currencyCode: "INR" }, compareAtPrice: null, selectedOptions: [{ name: "Size", value: "100 g" }], image: null, ...overrides };
}
export function makeProduct(overrides: Partial<StorefrontProduct> = {}): StorefrontProduct {
  const price = { amount: "320.00", currencyCode: "INR" };
  return { id: "gid://shopify/Product/101", handle: "test-tea", title: "Test tea", description: "Test fixture only.", productType: "Tea", vendor: "Nilkurinji", tags: [], featuredImage: null, images: [], variants: [makeVariant()], priceRange: { minVariantPrice: price, maxVariantPrice: price }, collectionHandles: ["tea"], faqs: [], approvedReviews: [], details: "", isPreview: false, ...overrides };
}
export function makeCart(overrides: Partial<ShopifyCart> = {}): ShopifyCart {
  const price = { amount: "320.00", currencyCode: "INR" };
  return { id: "gid://shopify/Cart/test", checkoutUrl: "https://example.myshopify.com/checkouts/test", totalQuantity: 1, cost: { subtotalAmount: price, totalAmount: price }, lines: { nodes: [{ id: "line-1", quantity: 1, cost: { totalAmount: price }, merchandise: { id: "gid://shopify/ProductVariant/101", title: "100 g", availableForSale: true, price, image: null, product: { id: "gid://shopify/Product/101", title: "Test tea", handle: "test-tea", featuredImage: null } } }] }, ...overrides };
}
