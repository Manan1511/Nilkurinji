import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/shopify/catalog";
import { isEligibleSearchQuery, normalizeSearchQuery, SEARCH_MAX_SUGGESTIONS } from "@/lib/search/query";
import type { PredictiveSearchPayload } from "@/lib/search/contract";

export async function GET(request: NextRequest): Promise<NextResponse<PredictiveSearchPayload>> {
  const query = normalizeSearchQuery(request.nextUrl.searchParams.get("q") ?? "");
  const headers = { "Cache-Control": "no-store" };
  if (!isEligibleSearchQuery(query)) return NextResponse.json({ status: "ok", source: null, query, items: [], hasMore: false }, { headers });
  try {
    const result = await searchProducts(query);
    if (result.source === "unavailable") throw new Error("unavailable");
    return NextResponse.json({ status: "ok", source: result.source, query, items: result.data.slice(0, SEARCH_MAX_SUGGESTIONS).map((product) => ({ id: product.id, handle: product.handle, title: product.title, image: product.featuredImage, price: product.priceRange?.minVariantPrice ?? null, isPreview: result.source === "preview" })), hasMore: result.data.length > SEARCH_MAX_SUGGESTIONS }, { headers });
  } catch {
    return NextResponse.json({ status: "error", query, items: [], hasMore: false, message: "Search is temporarily unavailable. Please try again." }, { status: 503, headers });
  }
}
