import { headers } from "next/headers";
import { normalizeSearchQuery } from "@/lib/search/query";
import { CATEGORIES } from "@/lib/site-config";
import { getStorefrontMode } from "@/lib/shopify/mode";
import {
  COLLECTION_BY_HANDLE_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
  RECOMMENDATIONS_QUERY,
  SEARCH_QUERY,
} from "@/lib/shopify/queries";
import { getPreviewCollection, getPreviewProduct, PREVIEW_PRODUCTS } from "@/lib/shopify/preview";
import { normalizeProduct } from "@/lib/shopify/normalize";
import { getBuyerIp, shopifyQuery } from "@/lib/shopify/server";
import type { StorefrontCollection, StorefrontData, StorefrontProduct } from "@/lib/shopify/types";

type ProductConnection = { nodes: Parameters<typeof normalizeProduct>[0][] };
type RawCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: StorefrontCollection["image"];
  products: ProductConnection;
};

async function currentBuyerIp(): Promise<string | undefined> {
  return getBuyerIp(await headers());
}

function unavailable<T>(reason: string): StorefrontData<T> {
  return { source: "unavailable", data: null, reason };
}

function handlePreviewProducts(handle: string): StorefrontProduct[] {
  return PREVIEW_PRODUCTS.filter((product) => product.collectionHandles.includes(handle));
}

export async function getProducts(): Promise<StorefrontData<StorefrontProduct[]>> {
  const mode = getStorefrontMode();
  if (mode.mode === "preview") return { source: "preview", data: PREVIEW_PRODUCTS };
  if (mode.mode === "unavailable") return unavailable(mode.reason);

  try {
    const data = await shopifyQuery<{ products: ProductConnection }>(PRODUCTS_QUERY, {
      first: 20,
      sortKey: "BEST_SELLING",
      reverse: false,
    }, { buyerIp: await currentBuyerIp(), tags: ["shopify-products"] });
    return { source: "shopify", data: data.products.nodes.map(normalizeProduct) };
  } catch {
    return unavailable("The live Shopify catalog is unavailable right now.");
  }
}

export async function getCollection(handle: string): Promise<StorefrontData<StorefrontCollection | null>> {
  const mode = getStorefrontMode();
  if (mode.mode === "preview") return { source: "preview", data: getPreviewCollection(handle) };
  if (mode.mode === "unavailable") return unavailable(mode.reason);
  if (!CATEGORIES.some((category) => category.handle === handle)) return { source: "shopify", data: null };

  try {
    const data = await shopifyQuery<{ collection: RawCollection | null }>(COLLECTION_BY_HANDLE_QUERY, { handle }, {
      buyerIp: await currentBuyerIp(),
      tags: [`shopify-collection-${handle}`],
    });
    const collection = data.collection;
    return {
      source: "shopify",
      data: collection ? {
        id: collection.id,
        handle: collection.handle,
        title: collection.title,
        description: collection.description,
        image: collection.image ?? null,
        products: collection.products.nodes.map(normalizeProduct),
      } : null,
    };
  } catch {
    return unavailable("This Shopify collection is temporarily unavailable.");
  }
}

export async function getProduct(handle: string): Promise<StorefrontData<StorefrontProduct | null>> {
  const mode = getStorefrontMode();
  if (mode.mode === "preview") return { source: "preview", data: getPreviewProduct(handle) };
  if (mode.mode === "unavailable") return unavailable(mode.reason);

  try {
    const data = await shopifyQuery<{ product: Parameters<typeof normalizeProduct>[0] | null }>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle },
      { buyerIp: await currentBuyerIp(), tags: [`shopify-product-${handle}`] },
    );
    return { source: "shopify", data: data.product ? normalizeProduct(data.product) : null };
  } catch {
    return unavailable("This Shopify product is temporarily unavailable.");
  }
}

export async function searchProducts(term: string): Promise<StorefrontData<StorefrontProduct[]>> {
  const query = normalizeSearchQuery(term);
  const mode = getStorefrontMode();
  if (!query) {
    if (mode.mode === "preview") return { source: "preview", data: [] };
    if (mode.mode === "unavailable") return unavailable(mode.reason);
    return { source: "shopify", data: [] };
  }
  if (mode.mode === "preview") {
    return { source: "preview", data: PREVIEW_PRODUCTS.filter((product) => product.title.toLowerCase().includes(query.toLowerCase())) };
  }
  if (mode.mode === "unavailable") return unavailable(mode.reason);

  try {
    const data = await shopifyQuery<{ search: { nodes: Parameters<typeof normalizeProduct>[0][] } }>(
      SEARCH_QUERY,
      { query, first: 20 },
      { buyerIp: await currentBuyerIp(), tags: ["shopify-search"] },
    );
    return { source: "shopify", data: data.search.nodes.map(normalizeProduct) };
  } catch {
    return unavailable("Shopify search is temporarily unavailable.");
  }
}

export async function getRecommendations(product: StorefrontProduct): Promise<StorefrontData<StorefrontProduct[]>> {
  const mode = getStorefrontMode();
  if (mode.mode === "preview") {
    return {
      source: "preview",
      data: handlePreviewProducts(product.collectionHandles[0] ?? "").filter((item) => item.id !== product.id),
    };
  }
  if (mode.mode === "unavailable") return unavailable(mode.reason);

  try {
    const data = await shopifyQuery<{ productRecommendations: Parameters<typeof normalizeProduct>[0][] | null }>(
      RECOMMENDATIONS_QUERY,
      { productId: product.id },
      { buyerIp: await currentBuyerIp(), tags: [`shopify-recommendations-${product.handle}`] },
    );
    const recommended = (data.productRecommendations ?? []).map(normalizeProduct).filter((item) => item.id !== product.id);
    if (recommended.length || !product.collectionHandles[0]) return { source: "shopify", data: recommended };

    const collection = await getCollection(product.collectionHandles[0]);
    return collection.source === "unavailable"
      ? unavailable(collection.reason)
      : { source: "shopify", data: collection.data?.products.filter((item) => item.id !== product.id) ?? [] };
  } catch {
    return unavailable("Shopify recommendations are temporarily unavailable.");
  }
}
