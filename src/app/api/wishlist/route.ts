import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/shopify/catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const handles = [...new Set((request.nextUrl.searchParams.get("handles") ?? "")
    .split(",")
    .filter((handle) => /^[a-z0-9-]{1,120}$/.test(handle)))]
    .slice(0, 20);
  const headers = { "Cache-Control": "private, no-store, max-age=0, must-revalidate" };
  if (handles.length === 0) return NextResponse.json({ products: [], source: "empty" }, { headers });

  const results = await Promise.all(handles.map((handle) => getProduct(handle)));
  if (results.some((result) => result.source === "unavailable")) {
    return NextResponse.json({ error: "Your wishlist is temporarily unavailable." }, { status: 503, headers });
  }
  return NextResponse.json({
    source: results.some((result) => result.source === "preview") ? "preview" : "shopify",
    products: results.flatMap((result) => result.source !== "unavailable" && result.data ? [result.data] : []),
  }, { headers });
}
