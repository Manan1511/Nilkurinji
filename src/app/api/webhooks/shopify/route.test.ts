import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/webhooks/shopify/route";
import { revalidateTag } from "next/cache";

vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));

const SECRET = "a-long-shopify-webhook-secret";
const BODY = '{"id":123,"title":"Tea"}';

function signature(body: string): string {
  return createHmac("sha256", SECRET).update(body).digest("base64");
}

function request(body = BODY, extra: Record<string, string> = {}): Request {
  return new Request("https://nilkurinji.example/api/webhooks/shopify", {
    method: "POST",
    headers: {
      "x-shopify-hmac-sha256": signature(body),
      "x-shopify-shop-domain": "nilkurinji-jcqze5tu.myshopify.com",
      "x-shopify-topic": "products/update",
      ...extra,
    },
    body,
  });
}

describe("Shopify cache webhook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "private-storefront-token-123");
    vi.stubEnv("SHOPIFY_WEBHOOK_SECRET", SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("invalidates the shared public catalog tags for a verified product delivery", async () => {
    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith("shopify-products", { expire: 0 });
    expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith("shopify-search", { expire: 0 });
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("rejects an invalid signature or a different Shopify store", async () => {
    const badSignature = await POST(request(BODY, { "x-shopify-hmac-sha256": "invalid" }));
    expect(badSignature.status).toBe(401);
    const wrongStore = await POST(request(BODY, { "x-shopify-shop-domain": "another-store.myshopify.com" }));
    expect(wrongStore.status).toBe(403);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("ignores signed topics outside the allowlist", async () => {
    const response = await POST(request(BODY, { "x-shopify-topic": "orders/create" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ received: true, ignored: true });
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("bounds the raw body before signature or JSON processing", async () => {
    const response = await POST(request("x".repeat(1_000_001)));

    expect(response.status).toBe(413);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
