# Vercel deployment and domain handoff

Vercel is the planned hosting platform. This file documents setup only; no Vercel project, domain, production deployment, or merchant configuration is assumed to exist.

## Project setup

1. Import the repository into the client-owned Vercel team.
2. Confirm framework detection identifies Next.js. Use npm run build and the standard Next.js output; do not configure static export or publish .next as a static directory.
3. Use separate Preview and Production environment variables. Add local-only values to .env.local, never to Git.
4. Keep Preview deployments in SHOPIFY_MODE=preview, SHOPIFY_CHECKOUT_ENABLED=false, SHOPIFY_CHECKOUT_FALLBACK_ENABLED=false, and SHOPIFY_INDEXING_ENABLED=false.
5. Configure production live catalog credentials only after Shopify Headless publication and token scopes are confirmed. Keep checkout closed and indexing disabled during verification.
6. Set SITE_URL to the exact approved canonical HTTPS origin. Do not guess a domain or alter DNS until the owner confirms it.
7. Add /account/callback to the Shopify Customer Account API allowed callback URLs for the staging and production origins.
8. Add /api/webhooks/payments/razorpay as the Razorpay webhook endpoint only after Razorpay is selected, approved and merchant onboarding is complete. Configure the matching signing secret. Do not configure a Cashfree callback until its supported Shopify integration is selected and implemented.
9. Configure domain and DNS using the Vercel project’s current dashboard instructions. Preserve existing email, verification and third-party records. Confirm TLS, canonical host and account/payment return URLs.
10. Keep the deployment behind the commerce and indexing gates until the content, policies, delivery, taxes, provider and test-order launch checks pass.

## Environment groups

Copy the names and safe local defaults from .env.example. Vercel variables are scoped independently to Preview and Production.

- Catalog: SHOPIFY_MODE, SHOPIFY_STORE_DOMAIN, SHOPIFY_API_VERSION, SHOPIFY_STOREFRONT_PRIVATE_TOKEN.
- Canonical origin: SITE_URL.
- Cart/account sessions: CART_COOKIE_SECRET, CUSTOMER_SESSION_SECRET, SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID, and optional SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET if Shopify issues one.
- Checkout: CHECKOUT_PROVIDER, CHECKOUT_ATTEMPT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET, SHOPIFY_CHECKOUT_ENABLED, SHOPIFY_CHECKOUT_FALLBACK_ENABLED, SHOPIFY_CHECKOUT_ALLOWED_HOSTS.
- Cache invalidation: SHOPIFY_WEBHOOK_SECRET and REVALIDATE_SECRET.
- Indexing: SHOPIFY_INDEXING_ENABLED.

Only the public Razorpay key ID reaches the client when the verified checkout flow starts. Storefront tokens, account secrets, cart/attempt secrets, Razorpay secret and webhook secret are server-only. Never add a NEXT_PUBLIC_ prefix to them.

Configure signed catalog/metaobject deliveries at /api/webhooks/shopify after setting SHOPIFY_WEBHOOK_SECRET. For page/blog content without a supported Shopify topic, an operator can POST an approved scope to /api/revalidate using the REVALIDATE_SECRET bearer token. Neither secret belongs in browser code or logs.

## Staging and production rules

Preview deployment:

- Fixture catalog only.
- Visible design-preview notice.
- Sample prices and concept imagery disclosed.
- No purchases, indexing or production customer data.

Production before launch:

- Live published Shopify products and content.
- Correct canonical URL and metadata.
- Noindex remains enabled until approval.
- Checkout remains disabled until provider/MID eligibility and Shopify order completion pass.

Production after launch approval:

- Set checkout and indexing gates independently.
- Run an owner-assisted test purchase/refund.
- Verify Shopify order, payment state, inventory and customer email.
- Confirm sitemap, robots, OAuth callback, payment webhook, TLS and domain redirects.

## Recovery

Use Vercel deployment history to roll back a bad release. Keep environment variables unchanged unless the rollback requires a corresponding code/configuration correction. For a payment with captured or uncertain status, stop new checkout attempts, inspect the provider and Shopify Admin, and follow the pending-order reconciliation procedure. Never retry by starting a second payment.

## Official references

- [Vercel: Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Vercel: environment variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel: domains](https://vercel.com/docs/domains)
- [Shopify Customer Account API setup](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/getting-started)
