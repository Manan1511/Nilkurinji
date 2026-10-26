import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { makeCart } from "../../../test/fixtures/storefront";
import { createRazorpayMagicCart, verifyRazorpayPaymentSignature } from "./razorpay-magic-core";

describe("Razorpay Magic cart mapping", () => {
  it("preserves the complete Shopify cart token and verified INR line identifiers", () => {
    const cart = makeCart({ id: "gid://shopify/Cart/token-part?key=opaque-key" });
    expect(createRazorpayMagicCart(cart)).toEqual({
      token: "token-part?key=opaque-key",
      note: null,
      attributes: {},
      item_count: 1,
      items: [{ id: 101, quantity: 1, product_id: 101, variant_id: 101, properties: {} }],
    });
  });

  it("rejects non-INR, unavailable, unsafe numeric ids and inconsistent quantity totals", () => {
    expect(() => createRazorpayMagicCart(makeCart({ cost: { subtotalAmount: { amount: "320", currencyCode: "USD" }, totalAmount: { amount: "320", currencyCode: "USD" } } }))).toThrow(/Indian rupees/);
    const unavailable = makeCart(); unavailable.lines.nodes[0].merchandise.availableForSale = false;
    expect(() => createRazorpayMagicCart(unavailable)).toThrow(/no longer available/);
    const unsafe = makeCart(); unsafe.lines.nodes[0].merchandise.id = "gid://shopify/ProductVariant/9007199254740992";
    expect(() => createRazorpayMagicCart(unsafe)).toThrow(/invalid productvariant/);
    expect(() => createRazorpayMagicCart(makeCart({ totalQuantity: 2 }))).toThrow(/item count/);
  });
});

describe("Razorpay payment signature verification", () => {
  it("uses constant-time comparison for the order and payment pair", () => {
    const orderId = "order_ABC123"; const paymentId = "pay_XYZ789"; const secret = "test-secret-with-enough-length";
    const signature = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
    expect(verifyRazorpayPaymentSignature(orderId, paymentId, signature, secret)).toBe(true);
    expect(verifyRazorpayPaymentSignature(orderId, "pay_OTHER", signature, secret)).toBe(false);
    expect(verifyRazorpayPaymentSignature("foreign-order", paymentId, signature, secret)).toBe(false);
  });
});
