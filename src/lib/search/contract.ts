import type { ShopifyImage, ShopifyMoney } from "@/lib/shopify/types";
import { SEARCH_MAX_SUGGESTIONS } from "./query";
export type SearchSuggestion = { id: string; handle: string; title: string; image: ShopifyImage | null; price: ShopifyMoney | null; isPreview: boolean };
export type PredictiveSearchPayload =
  | { status: "ok"; source: "shopify" | "preview" | null; query: string; items: SearchSuggestion[]; hasMore: boolean }
  | { status: "error"; query: string; items: []; hasMore: false; message: string };
const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
function isSuggestion(value: unknown, preview: boolean): value is SearchSuggestion {
  if (!record(value) || typeof value.id !== "string" || typeof value.handle !== "string" || !/^[a-z0-9-]{1,120}$/.test(value.handle) || typeof value.title !== "string" || value.isPreview !== preview) return false;
  if (value.price !== null && (!record(value.price) || typeof value.price.amount !== "string" || !Number.isFinite(Number(value.price.amount)) || Number(value.price.amount) < 0 || typeof value.price.currencyCode !== "string" || !/^[A-Z]{3}$/.test(value.price.currencyCode))) return false;
  if (value.image !== null && (!record(value.image) || typeof value.image.url !== "string" || !(value.image.url.startsWith("/images/") || value.image.url.startsWith("https://cdn.shopify.com/")) || !(value.image.altText === null || typeof value.image.altText === "string") || ![value.image.width, value.image.height].every((n) => n === null || (typeof n === "number" && Number.isFinite(n) && n > 0)))) return false;
  return true;
}
export function isPredictiveSearchPayload(value: unknown): value is PredictiveSearchPayload {
  if (!record(value) || typeof value.query !== "string" || !Array.isArray(value.items) || typeof value.hasMore !== "boolean") return false;
  if (value.status === "error") return value.items.length === 0 && value.hasMore === false && typeof value.message === "string";
  if (value.status !== "ok" || !["shopify", "preview", null].includes(value.source as string | null) || value.items.length > SEARCH_MAX_SUGGESTIONS) return false;
  if (value.source === null) return value.items.length === 0 && !value.hasMore;
  return value.items.every((item) => isSuggestion(item, value.source === "preview"));
}
