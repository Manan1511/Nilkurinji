import { NextRequest } from "next/server";
import { createShopifyCart, getShopifyCart, type ShopifyCart } from "@/lib/shopify/cart";
import { CART_COOKIE_NAME, readCartCookie } from "@/lib/shopify/cart-cookie";
import { checkoutAllowedHosts, getCheckoutProvider, isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { isSafeCheckoutUrl } from "@/lib/shopify/checkout-url";
import { parseCartAction } from "@/lib/shopify/cart-validation";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { getBuyerIp } from "@/lib/shopify/server";
import { CHECKOUT_ATTEMPT_COOKIE, CHECKOUT_ATTEMPT_MAX_AGE, readCheckoutAttempt, sealCheckoutAttempt } from "@/lib/checkout/attempt-cookie";
import { checkoutAttemptCookieOptions, checkoutJson, isSameOriginCheckoutRequest } from "@/lib/checkout/http";
import { createRazorpayMagicSession, getRazorpayOrderState, RazorpayMagicError } from "@/lib/checkout/razorpay-magic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function safeCheckoutUrl(url: string, storeDomain: string): string | null {
  return isSafeCheckoutUrl(url, storeDomain, checkoutAllowedHosts(storeDomain)) ? url : null;
}

export async function POST(request: NextRequest) {
  if (!isSameOriginCheckoutRequest(request)) return checkoutJson({ error: "This checkout request could not be verified." }, 403);
  if (Number(request.headers.get("content-length") ?? 0) > 4096) return checkoutJson({ error: "Checkout request is too large." }, 413);
  const mode = getStorefrontMode();
  if (mode.mode !== "live") return checkoutJson({ error: "Purchases are disabled in this storefront." }, mode.mode === "preview" ? 409 : 503);
  if (!isShopifyCheckoutEnabled()) return checkoutJson({ error: "Checkout is not enabled for this store yet." }, 503);

  let body: unknown;
  try { body = await request.json(); }
  catch { return checkoutJson({ error: "Checkout request must be valid JSON." }, 400); }
  const parsed = parseCartAction(body);
  if (!parsed.ok || (parsed.value.action !== "checkout" && parsed.value.action !== "buy-now")) return checkoutJson({ error: parsed.ok ? "Unsupported checkout action." : parsed.reason }, 400);
  const action = parsed.value;
  const buyerIp = getBuyerIp(request.headers);
  let cart: ShopifyCart;

  try {
    if (action.action === "buy-now") {
      cart = await createShopifyCart(action.variantId, action.quantity, buyerIp);
    } else {
      const cartSecret = process.env.CART_COOKIE_SECRET?.trim() ?? "";
      const signed = readCartCookie(request.cookies.get(CART_COOKIE_NAME)?.value, cartSecret);
      if (!signed) return checkoutJson({ error: "Your cart expired. Add your items again." }, 409);
      const existingCart = await getShopifyCart(signed.cartId, buyerIp);
      if (!existingCart) return checkoutJson({ error: "Your cart expired. Add your items again." }, 409);
      cart = existingCart;
    }
    if (!cart.lines.nodes.length) return checkoutJson({ error: "Your cart is empty. Add an item before checkout." }, 409);
    if (cart.lines.nodes.some((line) => !line.merchandise.availableForSale)) return checkoutJson({ error: "One or more items are no longer available. Update your cart and try again." }, 409);
    const checkoutUrl = safeCheckoutUrl(cart.checkoutUrl, mode.storeDomain);
    if (!checkoutUrl) return checkoutJson({ error: "Shopify returned an unexpected checkout address." }, 502);

    const provider = getCheckoutProvider();
    if (provider === "shopify") return checkoutJson({ checkoutUrl, buyNow: action.action === "buy-now" });
    if (provider !== "razorpay") return checkoutJson({ error: "The selected payment provider is not configured for Shopify checkout." }, 503);

    // Never start a second provider order while a previous attempt could still be paid.
    const previous = readCheckoutAttempt(request.cookies.get(CHECKOUT_ATTEMPT_COOKIE)?.value);
    if (previous) {
      const state = await getRazorpayOrderState(previous.orderId);
      if (state.amountPaid > 0 || state.status === "paid" || state.attempts > 0) {
        return checkoutJson({ error: "A previous payment is still being checked. Review its status before starting another payment.", statusPath: "/checkout/status" }, 409);
      }
    }

    const session = await createRazorpayMagicSession(cart);
    const attempt = {
      provider: "razorpay" as const,
      flow: action.action === "buy-now" ? "buy-now" as const : "cart" as const,
      orderId: session.orderId,
      shopifyCheckoutId: session.shopifyCheckoutId,
      fallbackUrl: checkoutUrl,
      expiresAt: Date.now() + CHECKOUT_ATTEMPT_MAX_AGE * 1000,
    };
    const response = checkoutJson({
      provider: "razorpay",
      session: { orderId: session.orderId, keyId: process.env.RAZORPAY_KEY_ID?.trim(), name: "Nilkurinji", accentColor: "#163122" },
      buyNow: action.action === "buy-now",
    });
    response.cookies.set(CHECKOUT_ATTEMPT_COOKIE, sealCheckoutAttempt(attempt), checkoutAttemptCookieOptions(CHECKOUT_ATTEMPT_MAX_AGE));
    return response;
  } catch (error) {
    if (error instanceof RazorpayMagicError) return checkoutJson({ error: error.message }, error.status);
    return checkoutJson({ error: "Checkout could not be prepared. Please review your cart and try again." }, 502);
  }
}
