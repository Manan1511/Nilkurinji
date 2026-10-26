# Shopify setup

Shopify is authoritative for live products, sellable pack variants, prices, availability, carts, customers, orders, policies and editable storefront content. The storefront calls Shopify from server code. Never send a private token to the browser.

The approved scope includes Tea, Tea Bags, Rice, Snacks and Other Foods in one Shop page. The Storefront API and Customer Account API default to version 2026-10. Review Shopify’s official version support schedule before changing it.

## 1. Store and channel

1. Use a merchant-eligible Shopify store and configure the Headless sales channel.
2. Enable Storefront API access for products, collections, search, recommendations, cart operations, public product metafields and public metaobjects.
3. Publish only approved products and content to the storefront.
4. Create a least-privilege private Storefront token.
5. Revoke and rotate any credential previously shared outside a secret manager. Do not reuse an Admin API token as a Storefront token.
6. Enable Shopify Customer Accounts and configure the Headless client for the Customer Account API.

Required access: product/collection reads; predictive and full search; cart create/read/update/remove; public metafield/metaobject reads; customer authentication, orders and addresses.

## 2. Environment

Copy .env.example to .env.local. Defaults keep the site in preview mode and keep checkout and indexing disabled.

| Variable | Use |
|---|---|
| SHOPIFY_MODE | preview or live |
| SHOPIFY_STORE_DOMAIN | Exact .myshopify.com hostname |
| SHOPIFY_API_VERSION | Pinned quarterly version, currently 2026-10 |
| SHOPIFY_STOREFRONT_PRIVATE_TOKEN | Server-only Storefront token |
| SITE_URL | Exact environment origin for OAuth/canonical URLs |
| CART_COOKIE_SECRET | At least 32 random characters |
| CUSTOMER_SESSION_SECRET | Long random session/encryption secret |
| SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID | Shopify Headless account client |
| SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET | Optional only if Shopify issues one |
| SHOPIFY_WEBHOOK_SECRET | Shopify app client secret used for HTTPS webhook HMAC verification |
| REVALIDATE_SECRET | At least 32 random characters for restricted manual invalidation |
| SHOPIFY_CHECKOUT_ENABLED | false until commerce verification |
| CHECKOUT_PROVIDER | Unselected; runtime recognizes shopify or razorpay |
| CHECKOUT_ATTEMPT_SECRET | At least 32 random characters for Razorpay attempts |
| RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET | Provider credentials; secret stays server-only |
| RAZORPAY_WEBHOOK_SECRET | Payment webhook signature secret |
| SHOPIFY_CHECKOUT_FALLBACK_ENABLED | false until recovery flow is approved |
| SHOPIFY_CHECKOUT_ALLOWED_HOSTS | Comma-separated exact verified HTTPS hosts |
| SHOPIFY_INDEXING_ENABLED | false until production launch approval |

Never expose secrets through NEXT_PUBLIC variables. Vercel Preview stays in preview mode, noindex and non-purchasable. Do not use production customer data in public previews.

Live mode returns unavailable rather than fixtures when Shopify configuration or requests fail. Preview is the only mode that uses sample catalog prices and concept imagery.

## 3. Catalog, products and collections

Create and publish these collections:

| Storefront category | Collection handle |
|---|---|
| All | shop-all |
| Tea | tea |
| Tea Bags | tea-bags |
| Rice | rice |
| Snacks | snacks |
| Other Foods | other-foods |
| Featured products | featured-products |

Put each product in its correct collection. Do not suppress food products from Shop, Search, direct product routes or recommendations.

Recommended model:

- One product per actual product/format identity.
- Variant option name: Pack size.
- Each sellable size/count has its own Shopify variant, SKU, price, inventory and shipping weight.
- Use sibling tea and tea-bag products when packaging, images, inventory or price differs.
- Prices and inventory remain native Shopify data.
- Check src/lib/shopify/catalog.ts before exceeding its bounded result limits.

Product tags power tea facets:

- Type: type:black-tea, type:green-tea and other approved values.
- Flavour: flavour:<approved-value>.
- Caffeine: caffeine:caffeinated, caffeine:decaffeinated or caffeine:caffeine-free.

Use stable slugs after each prefix. Multiple choices within one facet are alternatives; separate facets combine. Availability derives from Shopify variants. Price bands are under ₹300, ₹300–₹499 and ₹500+.

The Shop reads category banner content from public metaobjects of type nilkurinji_category, using collection handles above. The current query reads category title, intro and banner reference. The banner resolves eyebrow, heading, body, desktop/mobile images and alt text. Use panoramic artwork; do not stretch square medallions into banners.

## 4. Product metafields

The current GraphQL query reads these public fields in namespace nilkurinji:

| Key | Shopify type | Purpose |
|---|---|---|
| details | multi_line_text_field | Approved product details |
| how_its_made | multi_line_text_field | Product-specific making details, written as plain text |
| how_its_made_approved | boolean | Must be true before the storefront displays how_its_made |
| faqs | json | Approved question/answer entries |
| approved_reviews | json | Genuine reviews with publication approval |
| tea_profile | json | Optional validated tea profile |

tea_profile is ignored unless approved is explicitly true. It may include format, tasting notes and a brewing profile. Numeric values and strings are validated; do not put HTML in the field. Never show brewing instructions on rice or snacks.

The product page displays `how_its_made` only when `how_its_made_approved` is explicitly true and the value is valid plain text of at most 2,400 characters. Keep the copy product-specific and factual. Do not describe sourcing, hand-picking, processing methods or facilities unless Nilkurinji has confirmed them.

Use native product/variant fields for title, pack option, images, price, compare-at price and availability. Label, allergen, nutrition and tax facts require merchant review.

## 5. Homepage and category content

The homepage reads public metaobject type nilkurinji_home, handle home. Current required fields are heading and description. Current optional fields include eyebrow, featured_products_heading, hero_image, secondary_image, and verified social URLs. Additional fields are only supported when implemented in src/lib/shopify/content.ts. Missing live content never uses preview copy or local preview assets.

The category page queries nilkurinji_category by handle. Current fields are title, intro and banner. The referenced banner fields are eyebrow, heading, body, desktop_image, mobile_image and image_alt.

The detailed implementation plan defines additional site, story, values, trust, blog landing and shipping metaobjects. Before content entry, verify current query/type support and Storefront permissions. Do not assume an unimplemented field is displayed.

## 6. India delivery serviceability

Create public metaobject type nilkurinji_shipping, entry handle india. The current delivery endpoint reads its serviceability_file reference and freshness fields. Upload a Shopify Files CSV with columns:

    pincode,prepaid,cod,eta_min_days,eta_max_days

PINs must be six digits; prepaid/cod values true or false; ETA values may be blank. Remove duplicate/malformed rows. Set the verified timestamp and maximum age. The server accepts only Shopify CDN file URLs, bounds file size and returns unknown for missing, stale or unavailable data.

This lookup is advisory. It does not replace Shopify shipping profiles, provider rules or checkout eligibility. An outage does not block a valid checkout attempt.

Configure actual India market, fulfilment location, shipping rates, tax, COD eligibility and exclusions in Shopify/provider settings. No rate, threshold, ETA or COD coverage is assumed.

## 7. Customer Account API

Configure the Headless customer-account client and allow exact callback URLs:

    https://<approved-origin>/account/callback

Set SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID and the optional client secret if issued. Set SITE_URL separately for each environment. The storefront uses OAuth state, nonce and PKCE; session credentials remain in encrypted server-only cookies. Never put tokens in localStorage or public page data.

Verify login, callback, logout, order history, order ownership, token refresh and address add/edit/delete/default flows with test accounts.

## 8. Payment provider and checkout

The provider remains unselected. Razorpay Magic Checkout for headless Shopify is the technical baseline, not a merchant approval or payment result. The code contains a Razorpay-specific adapter and payment webhook route. Cashfree must not be enabled until a supported headless Shopify flow is verified for Shopify order creation, recovery, COD and refunds.

Runtime options:
- CHECKOUT_PROVIDER=razorpay: provider adapter, gated by live Shopify setup, checkout flag and required secrets.
- CHECKOUT_PROVIDER=shopify: Shopify hosted checkout, only when explicitly configured and approved.
- Cashfree: not implemented; checkout gate stays closed.

After provider onboarding, the Razorpay webhook URL is:

    https://<approved-origin>/api/webhooks/payments/razorpay

Configure its matching signing secret. Server code verifies signatures and captured status before requesting Shopify order completion. An uncertain/captured payment never starts a second payment attempt. Hosted checkout fallback is a separately configured recovery path.

Set SHOPIFY_CHECKOUT_ENABLED=false until tests verify product, pack, INR price, order, inventory, payment/COD status, email and refund. Provider payment success alone is not an end-to-end order test.

## 9. Cache invalidation

Configure HTTPS webhook subscriptions at /api/webhooks/shopify using the Shopify app client secret stored as SHOPIFY_WEBHOOK_SECRET. The handler verifies the raw-body HMAC, exact myshopify store domain and a topic allowlist before invalidating cache tags. Repeated deliveries are safe because the handler only repeats invalidation; webhook payloads never become catalog truth.

Subscribe to supported products create/update/delete, collections create/update/delete, product-publication updates, inventory-level updates, metafield create/update/delete and metaobject create/update/delete topics. Shopify’s current Admin GraphQL topic enum documents these topics and their access requirements. Do not assume article or page update topics exist.

For content changes without a supported webhook, an operator may call POST /api/revalidate with JSON scope catalog, content or all and the REVALIDATE_SECRET bearer token. This endpoint accepts only those scopes and invalidates fixed allowlisted tags. Do not place the secret in browser code or logs.

## 10. Preview, caching and indexing

- Public catalog/content reads use a 60-second server cache.
- Cart, account and checkout requests are uncached.
- Checkout refreshes current cart state.
- Vercel Preview deployments remain noindex and purchase-disabled.
- Production indexing requires live mode, production runtime and SHOPIFY_INDEXING_ENABLED=true.
- Payment webhooks are implemented at src/app/api/webhooks/payments/razorpay.
- Shopify webhook handling is implemented at src/app/api/webhooks/shopify; subscriptions and secret still require merchant setup.
- Restricted manual invalidation is implemented at src/app/api/revalidate.
- Test robots, sitemap and canonical URLs after a production domain is selected.

## References

- [Storefront API versioning](https://shopify.dev/docs/api/usage/versioning)
- [Storefront API authentication](https://shopify.dev/docs/api/storefront/latest)
- [Customer Account API](https://shopify.dev/docs/api/customer/latest)
- [Headless customer account setup](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/getting-started)
- [Shopify webhook topic reference](https://shopify.dev/docs/api/admin-graphql/latest/enums/WebhookSubscriptionTopic)
- [Shopify webhook signature verification](https://shopify.dev/docs/apps/build/webhooks/verify-deliveries)
- [Razorpay Magic Checkout for headless Shopify](https://razorpay.com/docs/payments/magic-checkout/shopify/custom/web-integration-nextjs)
