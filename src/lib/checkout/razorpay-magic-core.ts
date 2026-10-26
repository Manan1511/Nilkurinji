import type { ShopifyCart } from "@/lib/shopify/cart";
import { createHmac, timingSafeEqual } from "node:crypto";

export type RazorpayMagicCartLine = {
  id: number;
  quantity: number;
  product_id: number;
  variant_id: number;
  properties: Record<string, never>;
};

export type RazorpayMagicCart = {
  token: string;
  note: null;
  attributes: Record<string, never>;
  item_count: number;
  items: RazorpayMagicCartLine[];
};

function shopifyNumericId(id: string, type: "Product" | "ProductVariant"): number {
  const match = id.match(new RegExp(`^gid://shopify/${type}/(\\d+)$`));
  const value = Number(match?.[1]);
  if (!match || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Shopify returned an invalid ${type.toLowerCase()} identifier.`);
  }
  return value;
}

export function createRazorpayMagicCart(cart: ShopifyCart): RazorpayMagicCart {
  const prefix = "gid://shopify/Cart/";
  if (!cart.id.startsWith(prefix) || cart.id.length <= prefix.length) {
    throw new Error("Shopify returned an invalid cart identifier.");
  }
  if (cart.cost.totalAmount.currencyCode !== "INR" || cart.lines.nodes.some((line) => line.merchandise.price.currencyCode !== "INR")) {
    throw new Error("The payment provider can only accept this cart in Indian rupees.");
  }
  if (!cart.lines.nodes.length || cart.lines.nodes.some((line) => !line.merchandise.availableForSale)) {
    throw new Error("One or more cart options are no longer available.");
  }
  const items = cart.lines.nodes.map((line) => {
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 10) {
      throw new Error("Shopify returned an invalid cart quantity.");
    }
    const variantId = shopifyNumericId(line.merchandise.id, "ProductVariant");
    return {
      id: variantId,
      quantity: line.quantity,
      product_id: shopifyNumericId(line.merchandise.product.id, "Product"),
      variant_id: variantId,
      properties: {},
    };
  });
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  if (itemCount !== cart.totalQuantity || itemCount > 250) {
    throw new Error("Shopify returned an invalid cart item count.");
  }
  return {
    token: cart.id.slice(prefix.length),
    note: null,
    attributes: {},
    item_count: itemCount,
    items,
  };
}

export function verifyRazorpayPaymentSignature(orderId: string, paymentId: string, signature: string, secret: string): boolean {
  if (!/^order_[A-Za-z0-9]+$/.test(orderId) || !/^pay_[A-Za-z0-9]+$/.test(paymentId) || !/^[a-f0-9]{64}$/i.test(signature) || secret.length < 16) return false;
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest();
  const received = Buffer.from(signature, "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}
