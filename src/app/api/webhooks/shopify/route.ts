import { revalidateTag } from "next/cache";
import { getShopifyWebhookTags, normalizeShopifyDomain, verifyShopifyWebhookSignature } from "@/lib/shopify/webhook";
import { getStorefrontMode } from "@/lib/shopify/mode";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_BODY_BYTES = 1_000_000;

export async function POST(request: Request): Promise<Response> {
  const mode = getStorefrontMode();
  if (mode.mode !== "live") return Response.json({ error: "Shopify revalidation is not configured." }, { status: 503, headers: noStore() });

  const secret = process.env.SHOPIFY_WEBHOOK_SECRET?.trim() ?? "";
  if (secret.length < 16) return Response.json({ error: "Shopify webhook verification is not configured." }, { status: 503, headers: noStore() });

  const rawBody = await readBodyLimited(request, MAX_BODY_BYTES);
  if (rawBody === null) return Response.json({ error: "Webhook request is too large." }, { status: 413, headers: noStore() });
  if (!verifyShopifyWebhookSignature(rawBody, request.headers.get("x-shopify-hmac-sha256"), secret)) {
    return Response.json({ error: "Webhook signature could not be verified." }, { status: 401, headers: noStore() });
  }

  const storeDomain = normalizeShopifyDomain(request.headers.get("x-shopify-shop-domain"));
  if (!storeDomain || storeDomain !== mode.storeDomain) {
    return Response.json({ error: "Webhook store could not be verified." }, { status: 403, headers: noStore() });
  }

  const topic = request.headers.get("x-shopify-topic")?.trim().toLowerCase() ?? "";
  const tags = getShopifyWebhookTags(topic);
  if (!tags) return Response.json({ received: true, ignored: true }, { status: 200, headers: noStore() });

  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ received: true }, { status: 200, headers: noStore() });
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
