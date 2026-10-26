import { NextRequest } from "next/server";
import { CART_COOKIE_NAME } from "@/lib/shopify/cart-cookie";
import { checkoutAllowedHosts } from "@/lib/shopify/checkout-config";
import { isSafeCheckoutUrl } from "@/lib/shopify/checkout-url";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { CHECKOUT_ATTEMPT_COOKIE, readCheckoutAttempt } from "@/lib/checkout/attempt-cookie";
import { checkoutJson, clearCookie } from "@/lib/checkout/http";
import { completeRazorpayMagicCheckout, getRazorpayOrderState, getRazorpayPayments, RazorpayMagicError } from "@/lib/checkout/razorpay-magic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function safeOrderUrl(url: string, domain: string): boolean {
  return isSafeCheckoutUrl(url, domain, checkoutAllowedHosts(domain));
}

export async function GET(request: NextRequest) {
  const attempt = readCheckoutAttempt(request.cookies.get(CHECKOUT_ATTEMPT_COOKIE)?.value);
  if (!attempt) return checkoutJson({ status: "no-attempt", message: "There is no active payment to check." });
  try {
    const [order, payments] = await Promise.all([
      getRazorpayOrderState(attempt.orderId),
      getRazorpayPayments(attempt.orderId),
    ]);
    const captured = payments.filter((payment) => payment.status === "captured");
    if (captured.length === 1 && (!attempt.paymentId || attempt.paymentId === captured[0].id)) {
      const completion = await completeRazorpayMagicCheckout(captured[0].id, attempt.orderId);
      const mode = getStorefrontMode();
      if (mode.mode === "live" && safeOrderUrl(completion.orderStatusUrl, mode.storeDomain)) {
        const response = checkoutJson({ status: "confirmed", orderStatusUrl: completion.orderStatusUrl });
        clearCookie(response, CHECKOUT_ATTEMPT_COOKIE);
        if (attempt.flow === "cart") clearCookie(response, CART_COOKIE_NAME);
        return response;
      }
      return checkoutJson({ status: "pending", message: "Payment was received. Shopify is still confirming the order." }, 202);
    }
    if (captured.length > 1 || order.amountPaid > 0 || payments.some((payment) => payment.status === "authorized")) {
      return checkoutJson({ status: "pending", message: "Payment is being confirmed. Do not start another payment." }, 202);
    }

    const allFailed = order.attempts > 0 && payments.length > 0 && payments.every((payment) => payment.status === "failed");
    if ((order.status === "created" && order.attempts === 0) || allFailed) {
      const mode = getStorefrontMode();
      const fallbackEnabled = process.env.SHOPIFY_CHECKOUT_FALLBACK_ENABLED?.trim().toLowerCase() === "true" && mode.mode === "live" && safeOrderUrl(attempt.fallbackUrl, mode.storeDomain);
      const response = checkoutJson({
        status: "not-paid",
        message: "No payment was captured. You can return to your cart and try checkout again.",
        ...(fallbackEnabled ? { fallbackUrl: attempt.fallbackUrl } : {}),
      });
      if (allFailed) clearCookie(response, CHECKOUT_ATTEMPT_COOKIE);
      return response;
    }
    return checkoutJson({ status: "pending", message: "Payment is still being confirmed. Do not pay again while we check its status." }, 202);
  } catch (error) {
    return checkoutJson({ status: "pending", message: error instanceof RazorpayMagicError ? error.message : "Payment status is temporarily unavailable. Do not pay again yet." }, 202);
  }
}
