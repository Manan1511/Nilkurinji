import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { getShopifyWebhookTags } from "@/lib/shopify/webhook";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Scope = "catalog" | "content" | "all";

export async function POST(request: Request): Promise<Response> {
  const expected = process.env.REVALIDATE_SECRET?.trim() ?? "";
  const match = request.headers.get("authorization")?.match(/^Bearer ([^\s]+)$/i);
  const provided = match?.[1] ?? "";
  if (expected.length < 32) return Response.json({ error: "Manual revalidation is not configured." }, { status: 503, headers: noStore() });
  if (!safeEqual(provided, expected)) return Response.json({ error: "Unauthorized." }, { status: 401, headers: noStore() });

  const rawBody = await readBodyLimited(request, 2048);
  if (rawBody === null) return Response.json({ error: "Request is too large." }, { status: 413, headers: noStore() });
  let payload: unknown;
  try { payload = JSON.parse(rawBody); }
  catch { return Response.json({ error: "Request must be valid JSON." }, { status: 400, headers: noStore() }); }
  if (typeof payload !== "object" || payload === null || !["catalog", "content", "all"].includes(String((payload as { scope?: unknown }).scope))) {
    return Response.json({ error: "Choose catalog, content or all." }, { status: 400, headers: noStore() });
  }

  const scope = (payload as { scope: Scope }).scope;
  const productTags = getShopifyWebhookTags("products/update") ?? [];
  const contentTags = getShopifyWebhookTags("metaobjects/update") ?? [];
  const tags = scope === "catalog" ? productTags : scope === "content" ? contentTags : [...new Set([...productTags, ...contentTags])];
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: true, scope }, { status: 200, headers: noStore() });
}

function safeEqual(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function noStore(): HeadersInit {
  return { "Cache-Control": "private, no-store" };
}

async function readBodyLimited(request: Request, limit: number): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(body);
}
