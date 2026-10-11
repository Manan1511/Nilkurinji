# Nilkurinji storefront implementation spec

## Goal and constraints

Build the approved responsive storefront in this repository using Next.js App Router, React, TypeScript, Tailwind CSS, Netlify's automatic OpenNext runtime, and Shopify's Storefront API. Follow the supplied homepage PDFs for composition and visual identity. Shopify-hosted checkout remains the only payment surface. The local catalog is preview-only, visibly identified as such, without invented prices or purchasable demo products.

## Routes

- `/`: hero, five category links, best-seller area, benefits strip, banner carousel.
- `/shop`, `/collections/[handle]`: browse/search-compatible catalog, facets/sort, empty/preview/live states.
- `/products/[handle]`: image gallery, variant and quantity controls, add/buy actions, product details, FAQs, approved-review slot, related products.
- `/cart`: Shopify-derived lines, quantities, totals, availability errors, and hosted-checkout handoff.
- `/search`: Shopify search with filters and sort.
- `/wishlist`: browser/device saved variant/product handles.
- `/about`, `/contact`, `/pages/privacy-policy`, `/pages/refund-policy`, `/pages/terms-and-conditions`.

Navigation is responsive and keyboard accessible, supports reduced motion, and never exposes private tokens. Meta, canonical, sitemap, robots, social previews, and factual Product JSON-LD are required. Preview must be noindex. Shopify API errors render an honest unavailable state, never demo fallbacks in live mode.

## Shopify integration

All Storefront API traffic is server-side. Server configuration uses `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`, `SHOPIFY_API_VERSION`, `SHOPIFY_MODE`, and `CART_COOKIE_SECRET`. Public pages revalidate at 60 seconds; cart reads/mutations are uncached. Send the private token and server-observed buyer IP only from the server. Signed, HttpOnly, SameSite=Lax cart cookie. Enforce quantity bounds and an allow-listed Shopify checkout host. Buy Now creates a separate cart and leaves the shopping-cart cookie untouched.

Live mode requires valid runtime secrets and Shopify Headless publication; missing configuration/errors fail closed. Local preview data is separate from live services and explicitly not purchasable. Shopify Admin remains responsible for product/order/payment administration. Shopify pages/policies and the agreed homepage metaobject shape are documented in `docs/SHOPIFY_SETUP.md`.

## Netlify

Build with `npm run build`; publish `.next` through the automatic OpenNext runtime (do not pin its plugin). Do not configure VPS/Nginx. Do not add SPA catch-all rewrites. Public API data is cached for 60 seconds; personalized routes and endpoints are uncached. Netlify production/deploy-preview environment configuration and GoDaddy DNS handoff are documented; no deployment, domain mutation, or live payment configuration occurs as part of the source build.

## Verification

Add meaningful unit tests for preview/live separation, quantity/variant validation, signed/expired cart cookies, GraphQL errors, checkout URL validation, and Buy Now isolation. Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`. Verify responsive desktop/mobile pages and navigation/cart states in a browser. Do not claim a Shopify purchase test without a merchant store and owner-configured COD/Razorpay test modes.
