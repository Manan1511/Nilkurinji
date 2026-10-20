import { NextRequest, NextResponse } from "next/server";
import {
  CART_COOKIE_MAX_AGE_SECONDS,
  CART_COOKIE_NAME,
  createCartCookie,
  readCartCookie,
} from "@/lib/shopify/cart-cookie";
import {
  addShopifyCartLine,
  createShopifyCart,
  getShopifyCart,
  removeShopifyCartLine,
  ShopifyCartError,
  updateShopifyCartLine,
} from "@/lib/shopify/cart";
import { checkoutAllowedHosts, isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { isSafeCheckoutUrl } from "@/lib/shopify/checkout-url";
import { canAddCartQuantity, parseCartAction } from "@/lib/shopify/cart-validation";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { getBuyerIp, ShopifyRequestError } from "@/lib/shopify/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const COOKIE_SECRET = () => process.env.CART_COOKIE_SECRET ?? "";

function jsonNoStore(body: unknown, status = 200): NextResponse {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  return response;
}

function clearCartCookie(response: NextResponse): void {
  response.cookies.set(CART_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

function saveCartCookie(response: NextResponse, cartId: string): void {
  response.cookies.set(CART_COOKIE_NAME, createCartCookie(cartId, COOKIE_SECRET()), {
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

function isSameOriginRequest(request: NextRequest): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

function safeCheckoutUrl(url: string, storeDomain: string): string | null {
  return isSafeCheckoutUrl(url, storeDomain, checkoutAllowedHosts(storeDomain)) ? url : null;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const mode = getStorefrontMode();
  if (mode.mode === "preview") return jsonNoStore({ cart: null, preview: true, purchasingEnabled: false });
  if (mode.mode === "unavailable") return jsonNoStore({ cart: null, error: "The cart is temporarily unavailable. Try again shortly.", purchasingEnabled: false }, 503);
  if (COOKIE_SECRET().length < 32) return jsonNoStore({ cart: null, purchasingEnabled: false });

  const signedCart = readCartCookie(request.cookies.get(CART_COOKIE_NAME)?.value, COOKIE_SECRET());
  if (!signedCart) {
    const response = jsonNoStore({ cart: null, purchasingEnabled: isShopifyCheckoutEnabled() });
    if (request.cookies.has(CART_COOKIE_NAME)) clearCartCookie(response);
    return response;
  }

  try {
    const cart = await getShopifyCart(signedCart.cartId, getBuyerIp(request.headers));
    if (!cart) {
      const response = jsonNoStore({ cart: null, purchasingEnabled: isShopifyCheckoutEnabled(), expired: true });
      clearCartCookie(response);
      return response;
    }
    return jsonNoStore({ cart, purchasingEnabled: isShopifyCheckoutEnabled() });
  } catch {
    return jsonNoStore({ cart: null, error: "The cart is temporarily unavailable. Try again shortly." }, 502);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isSameOriginRequest(request)) return jsonNoStore({ error: "This cart request could not be verified." }, 403);
  if (Number(request.headers.get("content-length") ?? 0) > 4096) return jsonNoStore({ error: "Cart request is too large." }, 413);

  const mode = getStorefrontMode();
  if (mode.mode === "preview") return jsonNoStore({ error: "Checkout is disabled for this preview storefront." }, 409);
  if (mode.mode === "unavailable") return jsonNoStore({ error: "The cart is temporarily unavailable. Try again shortly." }, 503);
  if (!isShopifyCheckoutEnabled()) return jsonNoStore({ error: "Shopify checkout is not enabled yet." }, 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ error: "Cart request must be valid JSON." }, 400);
  }
  const parsed = parseCartAction(body);
  if (!parsed.ok) return jsonNoStore({ error: parsed.reason }, 400);

  const action = parsed.value;
  const secret = COOKIE_SECRET();
  const signedCart = readCartCookie(request.cookies.get(CART_COOKIE_NAME)?.value, secret);
  const buyerIp = getBuyerIp(request.headers);

  try {
    if (action.action === "buy-now") {
      const cart = await createShopifyCart(action.variantId, action.quantity, buyerIp);
      if (!cart.lines.nodes.length || cart.lines.nodes.some((line) => !line.merchandise.availableForSale)) {
        return jsonNoStore({ error: "That option is no longer available. Return to the product page and try again." }, 409);
      }
      const checkoutUrl = safeCheckoutUrl(cart.checkoutUrl, mode.storeDomain);
      if (!checkoutUrl) return jsonNoStore({ error: "Shopify returned an unexpected checkout address." }, 502);
      return jsonNoStore({ checkoutUrl, cartId: cart.id, buyNow: true });
    }

    if (action.action === "checkout") {
      if (!signedCart) {
        const response = jsonNoStore({ error: "Your cart expired. Add your items again." }, 409);
        clearCartCookie(response);
        return response;
      }
      const cart = await getShopifyCart(signedCart.cartId, buyerIp);
      if (!cart) {
        const response = jsonNoStore({ error: "Your cart expired. Add your items again." }, 409);
        clearCartCookie(response);
        return response;
      }
      if (!cart.lines.nodes.length) return jsonNoStore({ error: "Your cart is empty. Add an item before checkout." }, 409);
      if (cart.lines.nodes.some((line) => !line.merchandise.availableForSale)) {
        return jsonNoStore({ error: "One or more items are no longer available. Update your cart and try again." }, 409);
      }
      const checkoutUrl = safeCheckoutUrl(cart.checkoutUrl, mode.storeDomain);
      if (!checkoutUrl) return jsonNoStore({ error: "Shopify returned an unexpected checkout address." }, 502);
      return jsonNoStore({ checkoutUrl });
    }

    if (action.action === "add") {
      let cart = signedCart ? await getShopifyCart(signedCart.cartId, buyerIp) : null;
      if (cart && !canAddCartQuantity(cart.lines.nodes, action.variantId, action.quantity)) {
        return jsonNoStore({ error: "A maximum of 10 of the same option can be added to your cart." }, 409);
      }
      if (!cart) cart = await createShopifyCart(action.variantId, action.quantity, buyerIp);
      else cart = await addShopifyCartLine(cart.id, action.variantId, action.quantity, buyerIp);
      const response = jsonNoStore({ cart, purchasingEnabled: true });
      saveCartCookie(response, cart.id);
      return response;
    }

    if (!signedCart) {
      const response = jsonNoStore({ error: "Your cart expired. Add your items again." }, 409);
      clearCartCookie(response);
      return response;
    }
    const currentCart = await getShopifyCart(signedCart.cartId, buyerIp);
    if (!currentCart) {
      const response = jsonNoStore({ error: "Your cart expired. Add your items again." }, 409);
      clearCartCookie(response);
      return response;
    }

    if (!currentCart.lines.nodes.some((line) => line.id === action.lineId)) {
      return jsonNoStore({ error: "That cart item is no longer available. Refresh your cart and try again." }, 409);
    }

    const cart = action.action === "update"
      ? await updateShopifyCartLine(currentCart.id, action.lineId, action.quantity, buyerIp)
      : await removeShopifyCartLine(currentCart.id, action.lineId, buyerIp);
    const response = jsonNoStore({ cart, purchasingEnabled: true });
    if (cart.totalQuantity === 0) clearCartCookie(response);
    else saveCartCookie(response, cart.id);
    return response;
  } catch (error) {
    if (error instanceof ShopifyCartError) {
      return jsonNoStore({ error: error.message }, error.kind === "unavailable" ? 409 : 400);
    }
    if (error instanceof ShopifyRequestError) {
      return jsonNoStore({ error: "Shopify could not update the cart. Check availability and try again." }, 502);
    }
    return jsonNoStore({ error: "The cart is temporarily unavailable. Try again shortly." }, 502);
  }
}
