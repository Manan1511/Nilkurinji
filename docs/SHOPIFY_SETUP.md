# Shopify content and commerce setup

Shopify is the authority for every live product, option, price, availability state, cart, and checkout. This app calls the Storefront GraphQL API from Next.js server code; the browser never receives the private Storefront token. Shopify hosts checkout and owns orders, taxes, shipping calculations, payments, COD, and refunds.

## 1. Configure the Headless storefront

In Shopify Admin, install/open the **Headless** sales channel, select the storefront, and enable the Storefront API permissions needed to read products, collections, product metafields/metaobjects, pages, policies, search, recommendations, and to read/write carts. Publish the approved products and collections to that Headless storefront. If the store cannot use Headless or publish products, resolve eligibility or migrate to an eligible merchant store before live launch.

Create a new private Storefront API token for this deployment. The private token previously shared in chat must be rotated in Shopify Admin and replaced everywhere before production. Never put either token in source code, `NEXT_PUBLIC_*`, client components, public build variables, screenshots, or a committed `.env` file. The public token can remain unused; this implementation uses the private server-side token.

## 2. Local environment and safe modes

Copy `.env.example` to `.env.local`. The default is a non-indexable, visibly labelled preview with unpriced, non-purchasable layout fixtures. The fixture catalog is never used to recover from a live Shopify error.

For live catalog development, set these values locally only after the new token is ready:

```dotenv
SHOPIFY_MODE=live
SHOPIFY_STORE_DOMAIN=nilkurinji-jcqze5tu.myshopify.com
SHOPIFY_API_VERSION=2026-10
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=<new-private-token>
CART_COOKIE_SECRET=<random-secret-at-least-32-characters>
SHOPIFY_CHECKOUT_ENABLED=false
SHOPIFY_INDEXING_ENABLED=false
SHOPIFY_CHECKOUT_ALLOWED_HOSTS=
SITE_URL=https://<approved-site-domain>
SHOPIFY_CUSTOMER_ACCOUNT_URL=
```

Generate a cookie secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`. Keep checkout disabled while using a development store or while any launch gate is open. Live catalog, search, products, and policies fail with an unavailable state if Shopify is misconfigured or unreachable; draft/demo catalog data is not substituted.

Add the same variables to Netlify separately for **Deploy Previews** and **Production**. Keep Deploy Previews on `SHOPIFY_MODE=preview` unless there is a deliberate, secure Shopify test-store configuration. `SHOPIFY_CHECKOUT_ENABLED` and `SHOPIFY_INDEXING_ENABLED` must remain `false` in deploy previews. Production stays noindex until the owner completes the launch and explicitly sets `SHOPIFY_INDEXING_ENABLED=true`; that flag is independent of checkout testing and only works in a production runtime. Redeploy after changing server environment variables.

`SHOPIFY_CHECKOUT_ALLOWED_HOSTS` is optional. The store's `.myshopify.com` host is always included. Add another exact hostname only if Shopify returns a legitimate HTTPS checkout URL on it. Never use a wildcard or a user-controlled value. The server validates the returned HTTPS checkout URL before redirecting.

## 3. Publish the catalog

Create up to 20 approved products with real product images, titles, descriptions, product type, tags, variants/options, INR prices, availability/inventory, SEO title/description, and the actual food/product facts. Do not publish generated concept packaging or unconfirmed ingredient, sourcing, nutrition, health, delivery, or refund claims. The code requests up to 20 products and up to 50 variants per product.

Create Shopify collections with these exact handles and publish relevant products into them:

| Storefront category | Shopify collection handle |
| --- | --- |
| Tea | `tea` |
| Tea Bags | `tea-bags` |
| Rice | `rice` |
| Snacks | `snacks` |
| Other Foods | `other-foods` |

The category filter uses Shopify collection membership. Product type, INR price-band facets, and sorting use fields from the current Shopify result set. Product pages use Shopify recommendations first and fall back to other products in the first assigned collection. Shopify search and its returned product data drive the search page.

## 4. Product metafields

Create product metafields in namespace `nilkurinji`:

| Key | Suggested Shopify type | Value |
| --- | --- | --- |
| `details` | Multi-line text | Approved product information to show under the product description |
| `faqs` | JSON | Array of `{ "question": "...", "answer": "..." }` objects |
| `approved_reviews` | JSON | Array described below; only owner-approved genuine customer reviews |

Example FAQ value:

```json
[{"question":"How should I store this product?","answer":"Use the storage instructions confirmed on the product packaging."}]
```

Example review value (replace with a real approved review, never use this sample as customer content):

```json
[{"approved":true,"name":"Customer display name","rating":5,"title":"Optional title","body":"Approved review text","date":"2026-09-01"}]
```

The storefront ignores reviews without `approved: true`, invalid ratings, malformed JSON, or out-of-range content. Do not invent review text or publish a review without permission.

## 5. Homepage, pages, policies, accounts

Create and publish a metaobject definition with type `nilkurinji_home`, then create its entry with handle `home`. Add required text fields `eyebrow`, `heading`, and `description`; add optional file-reference fields `hero_image` and `secondary_image`; add optional text fields `secondary_eyebrow`, `secondary_heading`, and `secondary_description` (the second carousel slide appears only when all three are supplied); add optional `featured_products_heading`, `closing_eyebrow`, `closing_heading`, and `closing_description` text fields; and add optional single-line URL/text fields `instagram_url`, `facebook_url`, `youtube_url`, and `pinterest_url`. The social-link renderer accepts HTTPS URLs only on the corresponding official platform hostname. Homepage copy is required in live mode; missing or failed Shopify content displays a setup message, never draft copy. Preview-only artwork is not substituted for missing live hero images.

Create and publish Shopify Online Store pages with handles `about` and `contact`. Use the About page for owner-approved brand copy. Use Contact for confirmed email/phone/address/support links. The site does not invent contact details and does not submit a contact form.

Publish Shopify Privacy, Refund, and Terms of Service policies. The storefront maps them to `/pages/privacy-policy`, `/pages/refund-policy`, and `/pages/terms-and-conditions`. Review every policy with the business owner before turning on checkout.

Enable Shopify customer accounts in Admin. Set `SHOPIFY_CUSTOMER_ACCOUNT_URL` to the exact HTTPS account URL Shopify provides; the app accepts only the store's own Shopify domain or Shopify-owned account hosts and redirects safely.

## 6. Markets, shipping, COD, and online payments

The cart sends buyer country `IN`; the launch defaults are India and INR. Configure the Shopify market, INR prices, shipping zones/rates, tax settings, address requirements, and eligible products in Admin. The app cannot override Shopify checkout eligibility.

Configure online payment providers in Shopify Admin and verify the merchant account's current eligibility, settlement, test mode, and refund flow. If Razorpay is approved for this merchant, complete its Shopify Admin/app onboarding there. Add Cash on Delivery only through the payment option available to the actual Shopify store and confirm COD coverage, fees, order payment status, and fulfillment rules. Provider availability varies by merchant/account; this code does not implement or claim Razorpay/COD approval.

Checkout stays closed unless all live prerequisites are set and `SHOPIFY_CHECKOUT_ENABLED=true`. That flag is a code gate, not evidence of payment approval. Open it only after the owner has completed the checkout and order tests below.

## 7. Commerce acceptance test

On an eligible merchant store with test payment configuration:

1. Open a published product; confirm its Shopify title, images, option values, INR price, and availability.
2. Add it to the cart; refresh and confirm the signed cart persists. Change quantity, remove a line, and check the totals remain Shopify-derived.
3. Attempt a stale/out-of-stock item and an expired cart; confirm checkout is blocked and the shopper gets a clear recovery message.
4. Use Buy Now from one product while a different item is in the main cart; verify the separate checkout contains only the selected Buy Now item and the main cart remains unchanged.
5. Continue to Shopify-hosted checkout. Verify India address/shipping eligibility, test successful, failed, and abandoned online payments, then test COD only if configured.
6. Confirm the resulting Shopify order, channel attribution, payment/pending-payment status, inventory changes, cancellation, and owner-assisted refund.

Do not represent local cart mocks or an unupgraded development store as a real end-to-end payment test. Keep checkout closed if any test fails.

## Official references

- [Shopify Storefront API authentication and private-token headers](https://shopify.dev/docs/api/storefront/latest)
- [Set up the Storefront API](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started)
- [Manage the Headless sales channel](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/manage-headless-channels)
- [Shopify custom storefronts and hosted checkout](https://help.shopify.com/en/manual/custom-storefronts)
