export type StorefrontMode =
  | { mode: "preview" }
  | { mode: "unavailable"; reason: string }
  | { mode: "live"; storeDomain: string; apiVersion: string; privateToken: string };

type Environment = Record<string, string | undefined>;

const SHOP_DOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.myshopify\.com$/i;
const API_VERSION_PATTERN = /^20\d{2}-(01|04|07|10)$/;

export function resolveStorefrontMode(env: Environment): StorefrontMode {
  if (env.SHOPIFY_MODE?.trim().toLowerCase() !== "live") return { mode: "preview" };

  const storeDomain = env.SHOPIFY_STORE_DOMAIN?.trim().toLowerCase() ?? "";
  const apiVersion = env.SHOPIFY_API_VERSION?.trim() ?? "";
  const privateToken = env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim() ?? "";

  if (
    !SHOP_DOMAIN_PATTERN.test(storeDomain) ||
    !API_VERSION_PATTERN.test(apiVersion) ||
    privateToken.length < 16
  ) {
    return {
      mode: "unavailable",
      reason: "Live Shopify storefront configuration is incomplete.",
    };
  }

  return { mode: "live", storeDomain, apiVersion, privateToken };
}

export function getStorefrontMode(): StorefrontMode {
  return resolveStorefrontMode(process.env);
}
