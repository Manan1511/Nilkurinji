import { afterEach, describe, expect, it, vi } from "vitest";
import { readCheckoutAttempt, sealCheckoutAttempt } from "./attempt-cookie";

const secret = "checkout-attempt-secret-with-more-than-32-characters";
const attempt = { provider: "razorpay" as const, flow: "cart" as const, orderId: "order_ABC123", shopifyCheckoutId: "gid://shopify/Cart/token?key=secret", fallbackUrl: "https://example.myshopify.com/checkouts/abc", expiresAt: 10_000 };

afterEach(() => vi.unstubAllEnvs());

describe("encrypted checkout attempt cookie", () => {
  it("round-trips the secret checkout context and rejects tampering and expiry", () => {
    vi.stubEnv("CHECKOUT_ATTEMPT_SECRET", secret);
    const sealed = sealCheckoutAttempt(attempt);
    expect(sealed).not.toContain(attempt.orderId);
    expect(readCheckoutAttempt(sealed, 9_999)).toEqual(attempt);
    expect(readCheckoutAttempt(`X${sealed.slice(1)}`, 9_999)).toBeNull();
    expect(readCheckoutAttempt(sealed, 10_000)).toBeNull();
  });

  it("fails closed when the secret is missing", () => {
    vi.stubEnv("CHECKOUT_ATTEMPT_SECRET", "");
    expect(() => sealCheckoutAttempt(attempt)).toThrow(/not configured/);
  });
});
