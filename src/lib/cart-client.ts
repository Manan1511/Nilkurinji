"use client";
import type { CartAction } from "@/lib/shopify/cart-validation";
import type { ShopifyCart } from "@/lib/shopify/cart";
type CartResult = { cart?: ShopifyCart | null; checkoutUrl?: string; error?: string; buyNow?: boolean };
export type EmbeddedCheckoutSession = { provider: "razorpay"; orderId: string; keyId: string; name: string; accentColor: string };
type CheckoutResult = { provider?: "razorpay"; session?: EmbeddedCheckoutSession; checkoutUrl?: string; error?: string; statusPath?: string };

// A later request must see the cart cookie set by the previous response.
let pending: Promise<void> = Promise.resolve();
export function waitForCartMutations(): Promise<void> { return pending; }
export function postCartAction(action: CartAction): Promise<CartResult> {
  const request = pending.then(async () => {
    const response = await fetch("/api/cart", { method: "POST", credentials: "same-origin", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify(action) });
    const result = await response.json() as CartResult;
    if (!response.ok) throw new Error(result.error || "The cart could not be updated. Please try again.");
    return result;
  });
  pending = request.then(() => undefined, () => undefined);
  return request;
}

export function postCheckoutSession(action: Extract<CartAction, { action: "checkout" | "buy-now" }>): Promise<CheckoutResult> {
  const request = pending.then(async () => {
    const response = await fetch("/api/checkout/session", { method: "POST", credentials: "same-origin", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify(action) });
    const result = await response.json() as CheckoutResult;
    if (!response.ok) throw new Error(result.error || "Checkout could not be prepared. Please try again.");
    return result;
  });
  pending = request.then(() => undefined, () => undefined);
  return request;
}
