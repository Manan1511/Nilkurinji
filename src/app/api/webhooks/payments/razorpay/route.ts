import { NextRequest } from "next/server";
import { checkoutAllowedHosts, isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { isSafeCheckoutUrl } from "@/lib/shopify/checkout-url";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { checkoutJson } from "@/lib/checkout/http";
import { completeRazorpayMagicCheckout, getRazorpayPayments, RazorpayMagicError, verifyRazorpayWebhookSignature } from "@/lib/checkout/razorpay-magic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PaymentWebhook = {
  event?: unknown;
  payload?: { payment?: { entity?: { id?: unknown; order_id?: unknown; status?: unknown } } };
};

export async function POST(request: NextRequest) {
  if (process.env.CHECKOUT_PROVIDER?.trim().toLowerCase() !== "razorpay" || !isShopifyCheckoutEnabled()) return checkoutJson({ error: "Payment webhooks are not enabled." }, 503);
  if (Number(request.headers.get("content-length") ?? 0) > 1_000_000) return checkoutJson({ error: "Webhook request is too large." }, 413);
  const rawBody = await readBodyLimited(request, 1_000_000);
  if (rawBody === null) return checkoutJson({ error: "Webhook request is too large." }, 413);
  if (!verifyRazorpayWebhookSignature(rawBody, request.headers.get("x-razorpay-signature"))) return checkoutJson({ error: "Webhook signature could not be verified." }, 401);

  let event: PaymentWebhook;
  try { event = JSON.parse(rawBody) as PaymentWebhook; }
  catch { return checkoutJson({ error: "Webhook body must be valid JSON." }, 400); }
  if (event.event !== "payment.captured") return checkoutJson({ received: true, ignored: true });
  const payment = event.payload?.payment?.entity;
  const paymentId = typeof payment?.id === "string" ? payment.id : "";
  const orderId = typeof payment?.order_id === "string" ? payment.order_id : "";
  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId) || !/^order_[A-Za-z0-9]+$/.test(orderId) || payment?.status !== "captured") return checkoutJson({ error: "Captured payment event is incomplete." }, 400);

  try {
    const payments = await getRazorpayPayments(orderId);
    if (!payments.some((item) => item.id === paymentId && item.order_id === orderId && item.status === "captured")) return checkoutJson({ error: "Payment capture is not confirmed by Razorpay." }, 409);
    const completion = await completeRazorpayMagicCheckout(paymentId, orderId);
    const mode = getStorefrontMode();
    if (mode.mode !== "live" || !isSafeCheckoutUrl(completion.orderStatusUrl, mode.storeDomain, checkoutAllowedHosts(mode.storeDomain))) {
      return checkoutJson({ error: "Payment was captured, but Shopify order confirmation is pending." }, 502);
    }
    return checkoutJson({ received: true });
  } catch (error) {
    return checkoutJson({ error: error instanceof RazorpayMagicError ? error.message : "Shopify order completion is pending." }, 502);
  }
}

async function readBodyLimited(request: Request, limit: number): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(body);
}
