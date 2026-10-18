import { afterEach, describe, expect, it, vi } from "vitest";
import { parseCartAction } from "@/lib/shopify/cart-validation";
import { CART_COOKIE_NAME, createCartCookie, readCartCookie } from "@/lib/shopify/cart-cookie";
import { isSafeCheckoutUrl } from "@/lib/shopify/checkout-url";
import { resolveStorefrontMode } from "@/lib/shopify/mode";
import { parseApprovedReviews, parseFaqs } from "@/lib/shopify/product-content";
import { getBuyerIp, shopifyQuery } from "@/lib/shopify/server";
import { PREVIEW_PRODUCTS } from "@/lib/shopify/preview";
import { safeCustomerAccountUrl } from "@/lib/shopify/account-url";
import { getSocialLinks } from "@/lib/shopify/social-links";
import { POST as cartPost } from "@/app/api/cart/route";
import { NextRequest } from "next/server";
import { getHomepageContent } from "@/lib/shopify/content";
import { isIndexableSite } from "@/lib/shopify/checkout-config";

vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "203.0.113.8" }) }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("commerce safety boundaries", () => {
  it("keeps the full preview catalogue illustrative and non-purchasable", () => {
    expect(PREVIEW_PRODUCTS).toHaveLength(14);
    expect(PREVIEW_PRODUCTS.every((product) => product.isPreview && product.variants.length === 0)).toBe(true);
    expect(PREVIEW_PRODUCTS.every((product) => product.id.startsWith("preview-") && product.priceRange?.minVariantPrice.currencyCode === "INR")).toBe(true);
    expect(new Set(PREVIEW_PRODUCTS.map((product) => product.featuredImage?.url)).size).toBe(13);
    expect(PREVIEW_PRODUCTS.every((product) => /preview|illustrative/i.test(product.featuredImage?.altText ?? ""))).toBe(true);
  });

  it("defaults to non-purchasable preview unless live mode is explicitly configured", () => {
    expect(resolveStorefrontMode({})).toEqual({ mode: "preview" });
    expect(resolveStorefrontMode({ SHOPIFY_MODE: "live" })).toEqual({
      mode: "unavailable",
      reason: "Live Shopify storefront configuration is incomplete.",
    });
    expect(resolveStorefrontMode({ SHOPIFY_MODE: "live", SHOPIFY_STORE_DOMAIN: "bad.test" })).toEqual({
      mode: "unavailable",
      reason: "Live Shopify storefront configuration is incomplete.",
    });
    expect(resolveStorefrontMode({
      SHOPIFY_MODE: "live",
      SHOPIFY_STORE_DOMAIN: "nilkurinji-jcqze5tu.myshopify.com",
      SHOPIFY_STOREFRONT_PRIVATE_TOKEN: "server-only-test-secret",
      SHOPIFY_API_VERSION: "2026-10",
    })).toEqual({
      mode: "live",
      storeDomain: "nilkurinji-jcqze5tu.myshopify.com",
      apiVersion: "2026-10",
      privateToken: "server-only-test-secret",
    });
  });

  it("gates indexing with its own production flag, independently from checkout", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "server-only-test-secret");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    expect(isIndexableSite()).toBe(false);
    vi.stubEnv("SHOPIFY_INDEXING_ENABLED", "true");
    expect(isIndexableSite()).toBe(true);
    vi.stubEnv("SHOPIFY_INDEXING_ENABLED", "false");
    vi.stubEnv("SHOPIFY_CHECKOUT_ENABLED", "true");
    vi.stubEnv("CART_COOKIE_SECRET", "a-cart-secret-long-enough-to-pass-the-gate");
    expect(isIndexableSite()).toBe(false);
    vi.stubEnv("SHOPIFY_INDEXING_ENABLED", "true");
    vi.stubEnv("NODE_ENV", "development");
    expect(isIndexableSite()).toBe(false);
  });

  it("validates cart actions and bounds quantities to 1 through 10", () => {
    expect(parseCartAction({ action: "add", variantId: "gid://shopify/ProductVariant/123", quantity: 2 }))
      .toEqual({ ok: true, value: { action: "add", variantId: "gid://shopify/ProductVariant/123", quantity: 2 } });
    expect(parseCartAction({ action: "add", variantId: "preview-tea", quantity: 1 }).ok).toBe(false);
    expect(parseCartAction({ action: "add", variantId: "gid://shopify/ProductVariant/123", quantity: 0 }).ok).toBe(false);
    expect(parseCartAction({ action: "add", variantId: "gid://shopify/ProductVariant/123", quantity: 11 }).ok).toBe(false);
    expect(parseCartAction({ action: "remove", lineId: "gid://shopify/CartLine/123" }).ok).toBe(true);
    expect(parseCartAction({ action: "remove", lineId: "gid://shopify/CartLine/123?cart=opaque-token" }).ok).toBe(true);
    expect(parseCartAction({ action: "remove", lineId: "gid://shopify/CartLine/123?foreign=opaque-token" }).ok).toBe(false);
  });

  it("signs the cart ID, rejects tampering, and expires the cookie", () => {
    const now = Date.UTC(2026, 9, 11);
    const cookie = createCartCookie("gid://shopify/Cart/example?key=secret", "a-test-secret-with-enough-entropy", now);
    expect(readCartCookie(cookie, "a-test-secret-with-enough-entropy", now)?.cartId)
      .toBe("gid://shopify/Cart/example?key=secret");
    expect(readCartCookie(`${cookie}x`, "a-test-secret-with-enough-entropy", now)).toBeNull();
    expect(readCartCookie(cookie, "different-secret-with-enough-entropy", now)).toBeNull();
    expect(readCartCookie(cookie, "a-test-secret-with-enough-entropy", now + 31 * 86_400_000)).toBeNull();
  });

  it("only accepts HTTPS checkout URLs on the configured Shopify store", () => {
    const store = "nilkurinji-jcqze5tu.myshopify.com";
    expect(isSafeCheckoutUrl(`https://${store}/cart/c/abc`, store)).toBe(true);
    expect(isSafeCheckoutUrl(`https://evil.example/checkout`, store)).toBe(false);
    expect(isSafeCheckoutUrl(`http://${store}/checkout`, store)).toBe(false);
    expect(isSafeCheckoutUrl("javascript:alert(1)", store)).toBe(false);
  });

  it("keeps hosted account redirects on Shopify-owned HTTPS hosts", () => {
    expect(safeCustomerAccountUrl("https://shop.app/account", "nilkurinji-jcqze5tu.myshopify.com"))
      .toBe("https://shop.app/account");
    expect(safeCustomerAccountUrl("https://nilkurinji-jcqze5tu.myshopify.com/account", "nilkurinji-jcqze5tu.myshopify.com"))
      .toBe("https://nilkurinji-jcqze5tu.myshopify.com/account");
    expect(safeCustomerAccountUrl("https://evil.example/account", "nilkurinji-jcqze5tu.myshopify.com")).toBeNull();
    expect(safeCustomerAccountUrl("http://shop.app/account", "nilkurinji-jcqze5tu.myshopify.com")).toBeNull();
  });

  it("only renders configured social URLs on their matching official platform hosts", () => {
    expect(getSocialLinks({
      instagram_url: "https://www.instagram.com/nilkurinji/",
      facebook_url: "https://evil.example/nilkurinji",
      youtube_url: "http://youtube.com/@nilkurinji",
      pinterest_url: "https://pinterest.com/nilkurinji/",
    })).toEqual([
      { label: "Instagram", href: "https://www.instagram.com/nilkurinji/" },
      { label: "Pinterest", href: "https://pinterest.com/nilkurinji/" },
    ]);
  });

  it("accepts only well-formed product FAQ data", () => {
    expect(parseFaqs('[{"question":"How do I store it?","answer":"Keep it sealed."}]')).toEqual([
      { question: "How do I store it?", answer: "Keep it sealed." },
    ]);
    expect(parseFaqs("not-json")).toEqual([]);
    expect(parseFaqs('[{"question":"","answer":"invented"}]')).toEqual([]);
  });

  it("renders only owner-approved customer reviews", () => {
    const source = JSON.stringify([
      { approved: true, name: "A shopper", rating: 5, title: "Lovely", body: "A real approved review.", date: "2026-09-01" },
      { approved: false, name: "A shopper", rating: 5, body: "Not approved." },
      { approved: true, name: "A shopper", rating: 6, body: "Invalid rating." },
    ]);
    expect(parseApprovedReviews(source)).toEqual([
      { name: "A shopper", rating: 5, title: "Lovely", body: "A real approved review.", date: "2026-09-01" },
    ]);
    expect(parseApprovedReviews("invalid")).toEqual([]);
  });

  it("keeps the private token server-side and forwards Shopify's buyer IP header", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "server-test-secret");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { shop: { name: "Nilkurinji" } } })));
    vi.stubGlobal("fetch", fetchMock);

    await expect(shopifyQuery<{ shop: { name: string } }>("query { shop { name } }", {}, {
      buyerIp: "203.0.113.8",
      cache: "no-store",
    })).resolves.toEqual({ shop: { name: "Nilkurinji" } });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://nilkurinji-jcqze5tu.myshopify.com/api/2026-10/graphql.json");
    expect(new Headers(init.headers).get("Shopify-Storefront-Private-Token")).toBe("server-test-secret");
    expect(new Headers(init.headers).get("Shopify-Storefront-Buyer-IP")).toBe("203.0.113.8");
    expect(init.cache).toBe("no-store");
  });

  it("uses Netlify's client IP in production and only trusts forwarded IP locally", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(getBuyerIp(new Headers({ "x-forwarded-for": "203.0.113.9" }))).toBeUndefined();
    expect(getBuyerIp(new Headers({ "x-nf-client-connection-ip": "203.0.113.8", "x-forwarded-for": "203.0.113.9" }))).toBe("203.0.113.8");
    vi.stubEnv("NODE_ENV", "test");
    expect(getBuyerIp(new Headers({ "x-forwarded-for": "203.0.113.9" }))).toBe("203.0.113.9");
  });

  it("fails closed on Shopify GraphQL errors instead of returning an empty/demo result", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "server-test-secret");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: null,
      errors: [{ message: "Access denied" }],
    }))));

    await expect(shopifyQuery("query { products(first: 1) { nodes { id } } }", {}, { cache: "no-store" }))
      .rejects.toThrow("Shopify request failed: Access denied");
  });

  it("does not substitute draft homepage copy when Shopify content is missing or unavailable", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "server-test-secret");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: { metaobject: null },
    }))));

    await expect(getHomepageContent()).resolves.toMatchObject({
      source: "unavailable",
      data: null,
      reason: "Homepage content has not been published in Shopify yet.",
    });

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: null,
      errors: [{ message: "Access denied" }],
    }))));
    await expect(getHomepageContent()).resolves.toMatchObject({ source: "unavailable", data: null });
  });

  it("creates a separate Shopify cart for Buy now without writing the shopping-cart cookie", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "server-test-secret-value");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubEnv("SHOPIFY_CHECKOUT_ENABLED", "true");
    vi.stubEnv("CART_COOKIE_SECRET", "cart-cookie-secret-with-sufficient-entropy");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: { cartCreate: { cart: {
        id: "gid://shopify/Cart/buy-now",
        checkoutUrl: "https://nilkurinji-jcqze5tu.myshopify.com/cart/c/buy-now",
        totalQuantity: 1,
        cost: { subtotalAmount: { amount: "10", currencyCode: "INR" }, totalAmount: { amount: "10", currencyCode: "INR" } },
        lines: { nodes: [{
          id: "gid://shopify/CartLine/buy-now",
          quantity: 1,
          cost: { totalAmount: { amount: "10", currencyCode: "INR" } },
          merchandise: {
            id: "gid://shopify/ProductVariant/123",
            title: "Default Title",
            availableForSale: true,
            price: { amount: "10", currencyCode: "INR" },
            image: null,
            product: { id: "gid://shopify/Product/123", title: "Sample", handle: "sample", featuredImage: null },
          },
        }] },
      }, userErrors: [] } },
    }))));

    const request = new NextRequest("https://nilkurinji.test/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://nilkurinji.test" },
      body: JSON.stringify({ action: "buy-now", variantId: "gid://shopify/ProductVariant/123", quantity: 1 }),
    });
    const response = await cartPost(request);
    const result = await response.json() as { checkoutUrl?: string; buyNow?: boolean };

    expect(response.status).toBe(200);
    expect(result.buyNow).toBe(true);
    expect(result.checkoutUrl).toContain("/cart/c/buy-now");
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("rejects unavailable stock from Shopify without creating a local cart", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "server-test-secret-value");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubEnv("SHOPIFY_CHECKOUT_ENABLED", "true");
    vi.stubEnv("CART_COOKIE_SECRET", "cart-cookie-secret-with-sufficient-entropy");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: { cartCreate: { cart: null, userErrors: [{ field: ["input", "lines"], message: "This product is out of stock." }] } },
    }))));

    const request = new NextRequest("https://nilkurinji.test/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://nilkurinji.test" },
      body: JSON.stringify({ action: "add", variantId: "gid://shopify/ProductVariant/123", quantity: 1 }),
    });
    const response = await cartPost(request);
    const result = await response.json() as { error?: string };

    expect(response.status).toBe(409);
    expect(result.error).toContain("out of stock");
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("rejects an add that would exceed ten units of the same Shopify variant", async () => {
    const secret = "cart-cookie-secret-with-sufficient-entropy";
    const cartId = "gid://shopify/Cart/quantity-limit?key=opaque";
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "server-test-secret-value");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubEnv("SHOPIFY_CHECKOUT_ENABLED", "true");
    vi.stubEnv("CART_COOKIE_SECRET", secret);
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { cart: {
      id: cartId,
      checkoutUrl: "https://nilkurinji-jcqze5tu.myshopify.com/cart/c/current",
      totalQuantity: 10,
      cost: { subtotalAmount: { amount: "100", currencyCode: "INR" }, totalAmount: { amount: "100", currencyCode: "INR" } },
      lines: { nodes: [{
        id: "gid://shopify/CartLine/tea",
        quantity: 10,
        cost: { totalAmount: { amount: "100", currencyCode: "INR" } },
        merchandise: {
          id: "gid://shopify/ProductVariant/tea",
          title: "Default Title",
          availableForSale: true,
          price: { amount: "10", currencyCode: "INR" },
          image: null,
          product: { id: "gid://shopify/Product/tea", title: "Tea", handle: "tea", featuredImage: null },
        },
      }] },
    } } })));
    vi.stubGlobal("fetch", fetchMock);

    const request = new NextRequest("https://nilkurinji.test/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://nilkurinji.test",
        Cookie: `${CART_COOKIE_NAME}=${createCartCookie(cartId, secret)}`,
      },
      body: JSON.stringify({ action: "add", variantId: "gid://shopify/ProductVariant/tea", quantity: 1 }),
    });
    const response = await cartPost(request);
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ error: "A maximum of 10 of the same option can be added to your cart." });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("clears an expired signed cart and refuses hosted checkout", async () => {
    const secret = "cart-cookie-secret-with-sufficient-entropy";
    const cartId = "gid://shopify/Cart/expired?key=opaque";
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "server-test-secret-value");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubEnv("SHOPIFY_CHECKOUT_ENABLED", "true");
    vi.stubEnv("CART_COOKIE_SECRET", secret);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { cart: null } }))));
    const request = new NextRequest("https://nilkurinji.test/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://nilkurinji.test",
        Cookie: `${CART_COOKIE_NAME}=${createCartCookie(cartId, secret)}`,
      },
      body: JSON.stringify({ action: "checkout" }),
    });

    const response = await cartPost(request);
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ error: "Your cart expired. Add your items again." });
    expect(response.headers.get("set-cookie")).toContain(`${CART_COOKIE_NAME}=`);
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("blocks hosted checkout when Shopify reports a cart line unavailable", async () => {
    const secret = "cart-cookie-secret-with-sufficient-entropy";
    const cartId = "gid://shopify/Cart/expired-stock";
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "server-test-secret-value");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubEnv("SHOPIFY_CHECKOUT_ENABLED", "true");
    vi.stubEnv("CART_COOKIE_SECRET", secret);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: { cart: {
        id: cartId,
        checkoutUrl: "https://nilkurinji-jcqze5tu.myshopify.com/cart/c/current",
        totalQuantity: 1,
        cost: { subtotalAmount: { amount: "10", currencyCode: "INR" }, totalAmount: { amount: "10", currencyCode: "INR" } },
        lines: { nodes: [{
          id: "gid://shopify/CartLine/123",
          quantity: 1,
          cost: { totalAmount: { amount: "10", currencyCode: "INR" } },
          merchandise: {
            id: "gid://shopify/ProductVariant/123",
            title: "Default Title",
            availableForSale: false,
            price: { amount: "10", currencyCode: "INR" },
            image: null,
            product: { id: "gid://shopify/Product/123", title: "Sample", handle: "sample", featuredImage: null },
          },
        }] },
      } },
    }))));

    const cookie = createCartCookie(cartId, secret);
    const request = new NextRequest("https://nilkurinji.test/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://nilkurinji.test",
        Cookie: `${CART_COOKIE_NAME}=${cookie}`,
      },
      body: JSON.stringify({ action: "checkout" }),
    });
    const response = await cartPost(request);
    const result = await response.json() as { error?: string; checkoutUrl?: string };

    expect(response.status).toBe(409);
    expect(result.checkoutUrl).toBeUndefined();
    expect(result.error).toContain("no longer available");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
});
