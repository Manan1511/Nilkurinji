import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type { ShopifyCart } from "@/lib/shopify/cart";
import { createRazorpayMagicCart } from "@/lib/checkout/razorpay-magic-core";

type RazorpayCredentials = { keyId: string; keySecret: string };
type MagicCheckoutResponse = { shopify_checkout_id?: unknown };
type MagicOrderResponse = { order_id?: unknown };
type MagicCompleteResponse = { order_status_url?: unknown };

export class RazorpayMagicError extends Error {
  constructor(message: string, readonly status = 502) { super(message); this.name = "RazorpayMagicError"; }
}

export function getRazorpayCredentials(): RazorpayCredentials {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim() ?? "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() ?? "";
  if (!/^rzp_(test|live)_[A-Za-z0-9]+$/.test(keyId) || keySecret.length < 16) {
    throw new RazorpayMagicError("Razorpay Magic Checkout is not configured for this environment.", 503);
  }
  return { keyId, keySecret };
}

async function magicPost<T>(path: string, keyId: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`https://api.razorpay.com/v1${path}?key_id=${encodeURIComponent(keyId)}`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...(path === "/magic/order/shopify" ? { Origin: "https://api.razorpay.com" } : {}) },
      body: JSON.stringify(body),
    });
  } catch {
    throw new RazorpayMagicError("Razorpay could not be reached. No payment was started.");
  }
  if (!response.ok) {
    const status = response.status >= 400 && response.status < 500 ? 409 : 502;
    throw new RazorpayMagicError("Razorpay could not prepare checkout. No payment was started.", status);
  }
  try { return await response.json() as T; }
  catch { throw new RazorpayMagicError("Razorpay returned an invalid checkout response."); }
}

export async function createRazorpayMagicSession(cart: ShopifyCart): Promise<{ orderId: string; shopifyCheckoutId: string }> {
  const { keyId } = getRazorpayCredentials();
  let checkout: MagicCheckoutResponse;
  try {
    checkout = await magicPost<MagicCheckoutResponse>("/magic/checkout/shopify", keyId, { cart: createRazorpayMagicCart(cart) });
  } catch (error) {
    if (error instanceof RazorpayMagicError) throw error;
    throw new RazorpayMagicError(error instanceof Error ? error.message : "The cart is not ready for checkout.", 409);
  }
  if (typeof checkout.shopify_checkout_id !== "string" || !checkout.shopify_checkout_id.startsWith("gid://shopify/Cart/")) {
    throw new RazorpayMagicError("Razorpay returned an invalid Shopify checkout reference.");
  }
  const order = await magicPost<MagicOrderResponse>("/magic/order/shopify", keyId, { shopify_checkout_id: checkout.shopify_checkout_id });
  if (typeof order.order_id !== "string" || !/^order_[A-Za-z0-9]+$/.test(order.order_id)) {
    throw new RazorpayMagicError("Razorpay returned an invalid payment order reference.");
  }
  return { orderId: order.order_id, shopifyCheckoutId: checkout.shopify_checkout_id };
}

export async function completeRazorpayMagicCheckout(paymentId: string, orderId: string): Promise<{ orderStatusUrl: string }> {
  const { keyId } = getRazorpayCredentials();
  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId) || !/^order_[A-Za-z0-9]+$/.test(orderId)) throw new RazorpayMagicError("Payment confirmation is incomplete.", 400);
  const result = await magicPost<MagicCompleteResponse>("/1cc/shopify/complete", keyId, { razorpay_payment_id: paymentId, razorpay_order_id: orderId });
  if (typeof result.order_status_url !== "string") throw new RazorpayMagicError("Payment is received, but the Shopify order is still being confirmed.", 202);
  return { orderStatusUrl: result.order_status_url };
}

export type RazorpayOrderState = { status: string; amountPaid: number; attempts: number };
export type RazorpayPayment = { id: string; status: string; order_id: string | null };

async function razorpayGet<T>(path: string): Promise<T> {
  const { keyId, keySecret } = getRazorpayCredentials();
  let response: Response;
  try {
    response = await fetch(`https://api.razorpay.com/v1${path}`, {
      cache: "no-store",
      headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`, Accept: "application/json" },
    });
  } catch { throw new RazorpayMagicError("Payment status is temporarily unavailable."); }
  if (!response.ok) throw new RazorpayMagicError("Payment status is temporarily unavailable.");
  try { return await response.json() as T; }
  catch { throw new RazorpayMagicError("Razorpay returned an invalid payment status."); }
}

export async function getRazorpayOrderState(orderId: string): Promise<RazorpayOrderState> {
  if (!/^order_[A-Za-z0-9]+$/.test(orderId)) throw new RazorpayMagicError("Payment reference is invalid.", 400);
  const order = await razorpayGet<{ id?: unknown; status?: unknown; amount_paid?: unknown; attempts?: unknown }>(`/orders/${encodeURIComponent(orderId)}`);
  if (order.id !== orderId || typeof order.status !== "string" || typeof order.amount_paid !== "number" || typeof order.attempts !== "number") throw new RazorpayMagicError("Razorpay returned an incomplete payment status.");
  return { status: order.status, amountPaid: order.amount_paid, attempts: order.attempts };
}

export async function getRazorpayPayments(orderId: string): Promise<RazorpayPayment[]> {
  if (!/^order_[A-Za-z0-9]+$/.test(orderId)) throw new RazorpayMagicError("Payment reference is invalid.", 400);
  const payload = await razorpayGet<{ items?: unknown }>(`/orders/${encodeURIComponent(orderId)}/payments`);
  if (!Array.isArray(payload.items)) throw new RazorpayMagicError("Razorpay returned an incomplete payment list.");
  return payload.items.filter((item): item is RazorpayPayment => typeof item === "object" && item !== null && typeof (item as RazorpayPayment).id === "string" && typeof (item as RazorpayPayment).status === "string" && (item as RazorpayPayment).order_id === orderId);
}

export async function getCapturedRazorpayPayment(orderId: string): Promise<RazorpayPayment | null> {
  const payments = await getRazorpayPayments(orderId);
  return payments.find((payment) => payment.status === "captured") ?? null;
}

export function verifyRazorpayWebhookSignature(body: string, signature: string | null, secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim() ?? ""): boolean {
  if (!signature || secret.length < 16 || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(body).digest();
  const received = Buffer.from(signature, "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}
