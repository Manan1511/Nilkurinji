# 06. Shopify architecture

## APIs and data flow

Next.js server components/route handlers on Vercel call Shopify Storefront API and Customer Account API. Pin API version `2026-10` after confirming supported version at implementation; review quarterly. Storefront private token and all provider secrets stay server-only. Check GraphQL errors and mutation `userErrors` even when HTTP is 200. Preserve trusted buyer IP for buyer-originated requests using Vercel-supported request metadata.

Shopify owns catalog, variant prices, inventory, cart, customer, orders and page/policy content. No custom DB/admin is justified for launch. Public catalog/content cache 60 seconds; cart/accounts/checkout are private no-store. Shopify webhooks verify raw-body HMAC then invalidate tagged cache. Revalidate product, collection, inventory and metaobject changes; use TTL/manual protected refresh for unsupported blog/page topics. With current Next API, use `revalidateTag(tag, { expire: 0 })` for immediate sensitive invalidation.

## Customer accounts

Headless channel Customer Account API, OpenID discovery, OAuth state/nonce and PKCE. Store encrypted tokens in Secure, HttpOnly, SameSite=Lax cookies; no localStorage. Refresh safely, use Shopify logout endpoint, ensure customer order ownership. Measure token size; only add managed storage after evidence cookies cannot fit safely.

## Cart and checkout

Keep signed HttpOnly cart cookie, serialized mutations, no-cache operations and Buy Now isolated cart. Browser receives a safe cart DTO; never trusts client totals or order/payment status. One adapter starts hosted Shopify checkout or the selected embed. `POST /api/checkout/session`, `/complete`, `/status`, and provider webhook are server-owned boundaries.

Initial provider proof is Razorpay Magic Checkout’s documented Next.js/headless Shopify flow: create Shopify checkout mapping, create provider order, open SDK, complete provider flow into Shopify order. Merchant MID must be authorised. Cashfree is conditional on a documented equivalent headless Shopify order-completion flow. Generic payment widgets do not prove Shopify order sync. Verify signatures and current provider status; only then confirm order. Pre-capture failures may offer hosted fallback. After capture or uncertain status, show pending and reconcile; never launch another payment. Verify repeat completion and browser-close recovery.

## Search, SEO, preview and analytics

Predictive search via Storefront API; full search and Search & Discovery filters; validate filters server-side. The wishlist UI, state, route and API are removed; `/wishlist` redirects to `/shop` for bookmarked URLs. Canonical `/shop`; filtered/search/account/cart noindex. Product/Article/Breadcrumb/Organisation schema only from approved data and genuine ratings. Sitemap includes approved products/pages/articles. Preview fixtures disable purchases and indexing; no fixture fallback in live. GA4 events require consent and purchase fires only after Shopify order confirmation, deduped by order ID.

## Environment

Regular: `SHOPIFY_MODE`, `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_API_VERSION`, account client ID, `CHECKOUT_PROVIDER`, checkout/indexing flags, allowed checkout hosts, `SITE_URL`, public provider key ID and GA4 ID. Secrets: Storefront private token, customer-session secret, cart-cookie secret, Shopify webhook secret, revalidate secret, checkout-attempt secret, provider API/webhook secrets. No privileged `NEXT_PUBLIC_` variables.
