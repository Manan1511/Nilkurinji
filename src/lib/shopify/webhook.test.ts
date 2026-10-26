import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { getShopifyWebhookTags, verifyShopifyWebhookSignature } from "@/lib/shopify/webhook";

const SECRET = "a-long-shopify-webhook-secret";

function sign(body: string): string {
  return createHmac("sha256", SECRET).update(body).digest("base64");
}

describe("Shopify webhook helpers", () => {
  it("verifies the raw-body Shopify HMAC in constant-time compatible format", () => {
    const body = '{"id":123,"title":"Tea"}';
    expect(verifyShopifyWebhookSignature(body, sign(body), SECRET)).toBe(true);
    expect(verifyShopifyWebhookSignature(`${body} `, sign(body), SECRET)).toBe(false);
    expect(verifyShopifyWebhookSignature(body, "not-a-signature", SECRET)).toBe(false);
    expect(verifyShopifyWebhookSignature(body, sign(body), "short")).toBe(false);
  });

  it("invalidates shared product and shop surfaces on catalog events", () => {
    expect(getShopifyWebhookTags("products/update")).toEqual(expect.arrayContaining([
      "shopify-products", "shopify-search", "shopify-homepage", "shopify-category-tea-bags",
    ]));
  });

  it("invalidates relevant editorial, homepage and category tags on metaobject events", () => {
    expect(getShopifyWebhookTags("metaobjects/update")).toEqual(expect.arrayContaining([
      "shopify-homepage", "shopify-category-tea", "shopify-blog-recipes", "shopify-policies",
    ]));
  });

  it("does not accept unknown webhook topics", () => {
    expect(getShopifyWebhookTags("articles/update")).toBeNull();
    expect(getShopifyWebhookTags("orders/create")).toBeNull();
  });
});
