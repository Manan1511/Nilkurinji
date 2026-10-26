import "server-only";

import { isIP } from "node:net";
import { getStorefrontMode } from "@/lib/shopify/mode";

type GraphqlError = { message?: string };
type GraphqlEnvelope<T> = { data?: T | null; errors?: GraphqlError[] };

export class ShopifyRequestError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "ShopifyRequestError";
  }
}

export function getBuyerIp(headers: Headers): string | undefined {
  const candidates = [
    // Vercel overwrites this value at the edge, so clients cannot supply an
    // arbitrary address to Shopify's private Storefront API.
    headers.get("x-vercel-forwarded-for"),
    ...(process.env.NODE_ENV === "production" ? [] : [headers.get("x-forwarded-for")?.split(",")[0]?.trim()]),
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const normalized = candidate.replace(/^\[|\]$/g, "");
    if (isIP(normalized)) return normalized;
  }
  return undefined;
}

export async function shopifyQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: { buyerIp?: string; cache?: "public" | "no-store"; tags?: string[] } = {},
): Promise<T> {
  const config = getStorefrontMode();
  if (config.mode !== "live") {
    throw new ShopifyRequestError(config.mode === "unavailable" ? config.reason : "The live Shopify storefront is not enabled.");
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    "Shopify-Storefront-Private-Token": config.privateToken,
  });
  if (options.buyerIp && isIP(options.buyerIp)) {
    headers.set("Shopify-Storefront-Buyer-IP", options.buyerIp);
  }

  let response: Response;
  try {
    response = await fetch(`https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      ...(options.cache === "no-store"
        ? { cache: "no-store" as const }
        : { cache: "force-cache" as const, next: { revalidate: 60, tags: options.tags ?? ["shopify-storefront"] } }),
    });
  } catch {
    throw new ShopifyRequestError("Shopify is temporarily unreachable.");
  }

  if (!response.ok) throw new ShopifyRequestError("Shopify request failed.", response.status);

  let payload: GraphqlEnvelope<T>;
  try {
    payload = await response.json() as GraphqlEnvelope<T>;
  } catch {
    throw new ShopifyRequestError("Shopify returned an invalid response.");
  }

  if (payload.errors?.length) {
    const safeMessage = payload.errors.map((error) => error.message).find((message) => Boolean(message));
    throw new ShopifyRequestError(`Shopify request failed: ${safeMessage ?? "Unknown GraphQL error."}`);
  }
  if (!payload.data) throw new ShopifyRequestError("Shopify returned no storefront data.");
  return payload.data;
}
