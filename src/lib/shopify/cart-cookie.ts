import { createHmac, timingSafeEqual } from "node:crypto";

export const CART_COOKIE_NAME = "nk_cart";
export const CART_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type CartCookiePayload = { cartId: string; expiresAt: number };

function signatureFor(encodedPayload: string, secret: string): string {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

export function createCartCookie(cartId: string, secret: string, now = Date.now()): string {
  if (secret.length < 16) throw new Error("Cart cookie signing secret is not configured.");
  if (!cartId.startsWith("gid://shopify/Cart/")) throw new Error("Invalid Shopify cart ID.");
  const payload: CartCookiePayload = {
    cartId,
    expiresAt: now + CART_COOKIE_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${signatureFor(encodedPayload, secret)}`;
}

export function readCartCookie(value: string | undefined, secret: string, now = Date.now()): CartCookiePayload | null {
  if (!value || secret.length < 16) return null;
  const [encodedPayload, signature, extra] = value.split(".");
  if (!encodedPayload || !signature || extra) return null;

  const expected = Buffer.from(signatureFor(encodedPayload, secret));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<CartCookiePayload>;
    if (
      typeof payload.cartId !== "string" ||
      !payload.cartId.startsWith("gid://shopify/Cart/") ||
      typeof payload.expiresAt !== "number" ||
      !Number.isFinite(payload.expiresAt) ||
      payload.expiresAt <= now
    ) return null;
    return { cartId: payload.cartId, expiresAt: payload.expiresAt };
  } catch {
    return null;
  }
}
