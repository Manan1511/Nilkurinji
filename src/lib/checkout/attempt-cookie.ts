import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export const CHECKOUT_ATTEMPT_COOKIE = "nk_checkout_attempt";
export const CHECKOUT_ATTEMPT_MAX_AGE = 60 * 60 * 2;

export type CheckoutAttempt = {
  provider: "razorpay";
  flow: "cart" | "buy-now";
  orderId: string;
  shopifyCheckoutId: string;
  fallbackUrl: string;
  paymentId?: string;
  expiresAt: number;
};

function key(): Buffer {
  const secret = process.env.CHECKOUT_ATTEMPT_SECRET?.trim() ?? "";
  if (secret.length < 32) throw new Error("Checkout attempt signing is not configured.");
  return createHash("sha256").update(secret).digest();
}

export function sealCheckoutAttempt(attempt: CheckoutAttempt): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(attempt), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString("base64url")).join(".");
}

export function readCheckoutAttempt(value: string | undefined, now = Date.now()): CheckoutAttempt | null {
  if (!value) return null;
  try {
    const [ivPart, tagPart, cipherPart, extra] = value.split(".");
    if (!ivPart || !tagPart || !cipherPart || extra) return null;
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivPart, "base64url"));
    decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
    const clear = Buffer.concat([decipher.update(Buffer.from(cipherPart, "base64url")), decipher.final()]).toString("utf8");
    const valueObject = JSON.parse(clear) as Partial<CheckoutAttempt>;
    if (valueObject.provider !== "razorpay" || (valueObject.flow !== "cart" && valueObject.flow !== "buy-now") || typeof valueObject.orderId !== "string" || !/^order_[A-Za-z0-9]+$/.test(valueObject.orderId) || typeof valueObject.shopifyCheckoutId !== "string" || !valueObject.shopifyCheckoutId.startsWith("gid://shopify/Cart/") || typeof valueObject.fallbackUrl !== "string" || !valueObject.fallbackUrl.startsWith("https://") || typeof valueObject.expiresAt !== "number" || valueObject.expiresAt <= now || (valueObject.paymentId !== undefined && (typeof valueObject.paymentId !== "string" || !/^pay_[A-Za-z0-9]+$/.test(valueObject.paymentId)))) return null;
    return valueObject as CheckoutAttempt;
  } catch { return null; }
}
