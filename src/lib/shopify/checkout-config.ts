import "server-only";

import { getStorefrontMode } from "@/lib/shopify/mode";

export function isShopifyCheckoutEnabled(): boolean {
  return (
    getStorefrontMode().mode === "live" &&
    process.env.SHOPIFY_CHECKOUT_ENABLED?.trim().toLowerCase() === "true" &&
    (process.env.CART_COOKIE_SECRET?.length ?? 0) >= 32
  );
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
