import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("@/lib/shopify/mode", () => ({ getStorefrontMode: () => ({ mode: "live", storeDomain: "example.myshopify.com", apiVersion: "2026-10", privateToken: "not-a-real-token" }) }));
import { getCheckoutProvider, isShopifyCheckoutEnabled } from "./checkout-config";

afterEach(() => vi.unstubAllEnvs());

describe("checkout provider gate", () => {
  it("keeps checkout disabled until a provider is selected", () => {
    vi.stubEnv("SHOPIFY_CHECKOUT_ENABLED", "true");
    vi.stubEnv("CART_COOKIE_SECRET", "a-test-cart-secret-longer-than-32-characters");
    expect(getCheckoutProvider()).toBeNull();
    expect(isShopifyCheckoutEnabled()).toBe(false);
  });

  it("enables only the explicitly configured Shopify-hosted path or a complete Razorpay adapter", () => {
    vi.stubEnv("SHOPIFY_CHECKOUT_ENABLED", "true");
    vi.stubEnv("CART_COOKIE_SECRET", "a-test-cart-secret-longer-than-32-characters");
    vi.stubEnv("CHECKOUT_PROVIDER", "shopify");
    expect(isShopifyCheckoutEnabled()).toBe(true);
    vi.stubEnv("CHECKOUT_PROVIDER", "razorpay");
    expect(isShopifyCheckoutEnabled()).toBe(false);
    vi.stubEnv("RAZORPAY_KEY_ID", "rzp_test_0123456789");
    vi.stubEnv("RAZORPAY_KEY_SECRET", "test-razorpay-secret-at-least-sixteen");
    vi.stubEnv("CHECKOUT_ATTEMPT_SECRET", "checkout-attempt-secret-with-32-characters");
    expect(isShopifyCheckoutEnabled()).toBe(true);
    vi.stubEnv("CHECKOUT_PROVIDER", "cashfree");
    expect(isShopifyCheckoutEnabled()).toBe(false);
  });
});
