import { NextRequest } from "next/server";
import { CART_COOKIE_NAME } from "@/lib/shopify/cart-cookie";
import { checkoutAllowedHosts } from "@/lib/shopify/checkout-config";
import { isSafeCheckoutUrl } from "@/lib/shopify/checkout-url";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { CHECKOUT_ATTEMPT_COOKIE, CHECKOUT_ATTEMPT_MAX_AGE, readCheckoutAttempt, sealCheckoutAttempt } from "@/lib/checkout/attempt-cookie";
import { checkoutAttemptCookieOptions, checkoutJson, clearCookie, isSameOriginCheckoutRequest } from "@/lib/checkout/http";
import { verifyRazorpayPaymentSignature } from "@/lib/checkout/razorpay-magic-core";
import { completeRazorpayMagicCheckout, getRazorpayPayments, RazorpayMagicError } from "@/lib/checkout/razorpay-magic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CompletionBody = { razorpay_payment_id?: unknown; razorpay_order_id?: unknown; razorpay_signature?: unknown };

export async function POST(request: NextRequest) {
  if (!isSameOriginCheckoutRequest(request)) return checkoutJson({ error: "This payment confirmation could not be verified." }, 403);
  if (Number(request.headers.get("content-length") ?? 0) > 2048) return checkoutJson({ error: "Payment confirmation is too large." }, 413);
  const attempt = readCheckoutAttempt(request.cookies.get(CHECKOUT_ATTEMPT_COOKIE)?.value);
  if (!attempt || attempt.provider !== "razorpay") return checkoutJson({ error: "This checkout attempt has expired. Check your payment status before trying again.", statusPath: "/checkout/status" }, 409);

  let body: CompletionBody;
  try { body = await request.json() as CompletionBody; }
  catch { return checkoutJson({ error: "Payment confirmation must be valid JSON." }, 400); }
  const paymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
  const orderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id : "";
  const signature = typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim() ?? "";
  if (orderId !== attempt.orderId || !verifyRazorpayPaymentSignature(orderId, paymentId, signature, secret)) return checkoutJson({ error: "Payment confirmation could not be verified." }, 400);

  const resumableAttempt = { ...attempt, paymentId };
  try {
    const payments = await getRazorpayPayments(orderId);
    const captured = payments.some((payment) => payment.id === paymentId && payment.order_id === orderId && payment.status === "captured");
    if (!captured) {
      const response = checkoutJson({ status: "pending", statusPath: "/checkout/status", message: "Your payment is still being confirmed. Do not pay again while we check its status." }, 202);
      response.cookies.set(CHECKOUT_ATTEMPT_COOKIE, sealCheckoutAttempt(resumableAttempt), checkoutAttemptCookieOptions(CHECKOUT_ATTEMPT_MAX_AGE));
      return response;
    }

    const completion = await completeRazorpayMagicCheckout(paymentId, orderId);
    const mode = getStorefrontMode();
    if (mode.mode !== "live" || !isSafeCheckoutUrl(completion.orderStatusUrl, mode.storeDomain, checkoutAllowedHosts(mode.storeDomain))) {
      const response = checkoutJson({ status: "pending", statusPath: "/checkout/status", message: "Payment was received. Shopify is still confirming the order." }, 202);
      response.cookies.set(CHECKOUT_ATTEMPT_COOKIE, sealCheckoutAttempt(resumableAttempt), checkoutAttemptCookieOptions(CHECKOUT_ATTEMPT_MAX_AGE));
      return response;
    }

    const response = checkoutJson({ status: "confirmed", orderStatusUrl: completion.orderStatusUrl });
    clearCookie(response, CHECKOUT_ATTEMPT_COOKIE);
    if (attempt.flow === "cart") response.cookies.set(CART_COOKIE_NAME, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    return response;
  } catch (error) {
    const response = checkoutJson({ status: "pending", statusPath: "/checkout/status", message: error instanceof RazorpayMagicError && error.status === 202 ? error.message : "Payment may have been received. Do not start another payment until its status is checked." }, 202);
    response.cookies.set(CHECKOUT_ATTEMPT_COOKIE, sealCheckoutAttempt(resumableAttempt), checkoutAttemptCookieOptions(CHECKOUT_ATTEMPT_MAX_AGE));
    return response;
  }
}
