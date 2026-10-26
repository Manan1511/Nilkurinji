import "server-only";

import { getStorefrontMode } from "@/lib/shopify/mode";

export function isShopifyCheckoutEnabled(): boolean {
  if (getStorefrontMode().mode !== "live" || process.env.SHOPIFY_CHECKOUT_ENABLED?.trim().toLowerCase() !== "true" || (process.env.CART_COOKIE_SECRET?.length ?? 0) < 32) return false;
  const provider = process.env.CHECKOUT_PROVIDER?.trim().toLowerCase();
  if (provider === "shopify") return true;
  if (provider === "razorpay") {
    return /^rzp_(test|live)_[A-Za-z0-9]+$/.test(process.env.RAZORPAY_KEY_ID?.trim() ?? "")
      && (process.env.RAZORPAY_KEY_SECRET?.trim().length ?? 0) >= 16
      && (process.env.CHECKOUT_ATTEMPT_SECRET?.trim().length ?? 0) >= 32;
  }
  // Cashfree remains unavailable until its Shopify-order completion adapter is verified.
  return false;
}

export function getCheckoutProvider(): "shopify" | "razorpay" | "cashfree" | null {
  const provider = process.env.CHECKOUT_PROVIDER?.trim().toLowerCase();
  return provider === "shopify" || provider === "razorpay" || provider === "cashfree" ? provider : null;
}

export function isIndexableSite(): boolean {
  return (
    getStorefrontMode().mode === "live" &&
    process.env.SHOPIFY_INDEXING_ENABLED?.trim().toLowerCase() === "true" &&
    process.env.NODE_ENV === "production"
  );
}

export function checkoutAllowedHosts(storeDomain: string): string[] {
  const configured = (process.env.SHOPIFY_CHECKOUT_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter((host) => /^[a-z0-9.-]+$/.test(host));
  return [...new Set([storeDomain.toLowerCase(), ...configured])];
}
