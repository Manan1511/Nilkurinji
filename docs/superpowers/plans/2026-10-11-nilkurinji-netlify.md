# Nilkurinji Storefront — Netlify Implementation Plan

Spec: `docs/superpowers/specs/2026-10-11-nilkurinji-storefront-design.md`.

## Global constraints

- Match the two supplied PDFs; the PDFs remain user-owned root files and must not be staged.
- Shopify is the sole live source of products, variants, prices, inventory, cart, and checkout.
- No secret in source/client/browser build; never substitute preview data for live failures.
- Preview is explicitly labeled, unpriced, and non-purchasable; do not invent claims, policies, products, reviews, social/contact details, or business facts.
- Storefront supports five collection categories and India/INR only. Shopify's hosted checkout handles all payments.
- Netlify deployment configuration only; don't deploy, edit GoDaddy DNS, or alter a payment provider in this source milestone.

## Tasks

1. Scaffold current verified Next.js/React/TypeScript/Tailwind dependencies, Netlify OpenNext config, product/design context, fonts/tokens, accessible responsive shell, test/type/lint scripts. Tests: design-token/page-shell smoke and configuration checks. Expected: test red before implementation, then unit checks green; `npm run typecheck`, `npm run lint`.
2. Add strict Shopify types and server-only GraphQL client, product/collection/search/policy query mapping, 60-second public revalidation, preview/live isolation, and admin setup guide. Tests: API request headers/IP, GraphQL error handling, and no demo fallback on live failure. Expected: unit suite green; secrets absent from client bundle.
3. Build home, shop, five collections, product, search, wishlist pages and storefront interactions. Tests: category mapping and wishlist persistence/validation; run full unit suite and typecheck.
4. Build signed server cart-cookie utilities, Shopify cart endpoints, cart UI, add/update/remove, stock/expired-cart handling, and separate Buy Now checkout cart. Tests: signature tampering/expiry, quantities, Shopify user errors, allow-listed checkout URLs, and Buy Now isolation. Expected: unit suite green and no cart caching.
5. Add About/Contact/Shopify-policy pages, navigation/footer, factual SEO/schema, sitemap/robots, policy/content launch-gate handling, and accessible responsive polish. Tests: metadata/schema and route smoke checks. Expected: typecheck/lint/unit suite green; preview noindex.
6. Add runbook for Netlify, GoDaddy DNS, Shopify admin/Headless publishing, merchant/payment gates; verify production build and desktop/mobile/browser flows; inspect diff and detector output. Expected: all local commands pass; document external launch gates that remain blocked by absent admin/catalog/merchant facts.

## Review focus

Secret containment, preview/live isolation, server-side Shopify integration, buyer-IP forwarding, cache correctness, cookie verification and expiry, Buy Now isolation, quantity/availability checks, and no unsupported policy/product/customer claims.
