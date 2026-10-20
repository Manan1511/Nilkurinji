"use client";
import type { CartAction } from "@/lib/shopify/cart-validation";
import type { ShopifyCart } from "@/lib/shopify/cart";
type CartResult = { cart?: ShopifyCart | null; checkoutUrl?: string; error?: string; buyNow?: boolean };

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
