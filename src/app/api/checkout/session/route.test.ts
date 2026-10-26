import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { makeCart } from "../../../../../test/fixtures/storefront";
import { createCartCookie } from "@/lib/shopify/cart-cookie";

vi.mock("@/lib/shopify/mode", () => ({ getStorefrontMode: () => ({ mode: "live", storeDomain: "example.myshopify.com", apiVersion: "2026-10", privateToken: "test-fixture-only" }) }));
vi.mock("@/lib/shopify/checkout-config", () => ({ isShopifyCheckoutEnabled: () => true, getCheckoutProvider: () => "razorpay", checkoutAllowedHosts: (domain: string) => [domain] }));
vi.mock("@/lib/shopify/cart", () => ({ createShopifyCart: vi.fn(), getShopifyCart: vi.fn() }));
vi.mock("@/lib/shopify/server", () => ({ getBuyerIp: () => undefined }));
vi.mock("@/lib/checkout/razorpay-magic", () => ({ createRazorpayMagicSession: vi.fn(), getRazorpayOrderState: vi.fn() }));
import { getShopifyCart } from "@/lib/shopify/cart";
import { createRazorpayMagicSession } from "@/lib/checkout/razorpay-magic";
import { POST } from "./route";

const secret = "checkout-route-test-secret-long-enough-for-hmac";

function request(body: unknown, origin = "http://localhost") {
  const cartId = "gid://shopify/Cart/route-test?key=preserve-this-key";
  return new NextRequest("http://localhost/api/checkout/session", {
    method: "POST",
    headers: { origin, cookie: `nk_cart=${createCartCookie(cartId, secret)}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("CART_COOKIE_SECRET", secret);
  vi.stubEnv("CHECKOUT_ATTEMPT_SECRET", "attempt-secret-for-checkout-route-tests-32chars");
  vi.stubEnv("RAZORPAY_KEY_ID", "rzp_test_publickey123");
  vi.mocked(getShopifyCart).mockResolvedValue(makeCart({ id: "gid://shopify/Cart/route-test?key=preserve-this-key" }));
  vi.mocked(createRazorpayMagicSession).mockResolvedValue({ orderId: "order_Route123", shopifyCheckoutId: "gid://shopify/Cart/route-test?key=preserve-this-key" });
});
afterEach(() => vi.unstubAllEnvs());

describe("checkout session boundary", () => {
  it("builds an encrypted provider attempt from the server-confirmed Shopify cart", async () => {
    const response = await POST(request({ action: "checkout" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ provider: "razorpay", session: { orderId: "order_Route123", keyId: "rzp_test_publickey123" } });
    expect(createRazorpayMagicSession).toHaveBeenCalledWith(expect.objectContaining({ id: "gid://shopify/Cart/route-test?key=preserve-this-key" }));
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("set-cookie")).toContain("nk_checkout_attempt=");
    expect(response.headers.get("set-cookie")).not.toContain("order_Route123");
  });

  it("rejects a cross-origin request before reading or mutating Shopify checkout state", async () => {
    const response = await POST(request({ action: "checkout" }, "https://attacker.example"));
    expect(response.status).toBe(403);
    expect(createRazorpayMagicSession).not.toHaveBeenCalled();
  });

  it("creates Buy Now from its selected variant without using the ordinary cart cookie", async () => {
    const { createShopifyCart } = await import("@/lib/shopify/cart");
    vi.mocked(createShopifyCart).mockResolvedValue(makeCart({ id: "gid://shopify/Cart/buy-now" }));
    const response = await POST(request({ action: "buy-now", variantId: "gid://shopify/ProductVariant/101", quantity: 2 }));
    expect(response.status).toBe(200);
    expect(createShopifyCart).toHaveBeenCalledWith("gid://shopify/ProductVariant/101", 2, undefined);
    expect(getShopifyCart).not.toHaveBeenCalled();
  });
});
