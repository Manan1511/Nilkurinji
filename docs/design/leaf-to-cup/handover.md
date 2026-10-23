# Leaf to Cup implementation handover

## Delivered

- Replaced the generic storefront composition with a tea-led Leaf / Water / Cup home, selected teas, loose-tea and tea-bag format panels, a qualitative brewing sequence, a factual Kurinji note, pantry links, and compact footer.
- Added the compact shared header and notice, reusable paper/forest tokens, typography, editorial imagery, responsive catalog and product layouts, search overlay, shared cart state/drawer, and exclusive overlay behavior.
- Added an approved-only Shopify tea-profile parser and the homepage metaobject chapter/format/story/brewing content fields. Product prices, stock, variants, checkout, and live assets stay Shopify-authoritative.
- Kept preview purchases disabled, preview sample prices labelled, and preview content separate from live failures.
- Updated `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, Shopify setup notes, and asset documentation.

## Local preview

The local production preview is running at `http://127.0.0.1:3000` with `SHOPIFY_MODE=preview` set in the process environment. To reproduce locally after building, start a PowerShell session in the project and run:

```powershell
$env:SHOPIFY_MODE = 'preview'
npm run start
```

For live work, configure server-side values only through the deployment environment. Never copy private tokens into source, client bundles, or documentation.

## Content and launch gates

- Replace the illustrative tea scenes and category art with owner-approved photographs; the hero and format art is conceptual.
- Populate and approve the real product catalogue, variants, inventory, tasting details, product FAQs/reviews, and product-specific tea profiles in Shopify. Set a profile's `approved` field only after the underlying facts have been confirmed.
- Provide approved homepage chapter imagery and copy through the `nilkurinji_home` metaobject. Optional mobile chapter image references are supported. A botanical image remains absent until an authentic reference is supplied and approved.
- Confirm business contact links, About copy, legal policy content, shipping and COD rules, payment eligibility, and social URLs.
- Verify a merchant Shopify account and test Razorpay/COD, payment failure/cancellation, order creation, inventory, refund handling, and Shopify-hosted checkout before enabling purchases.
- Set production Netlify variables, indexing, custom domain, and HTTPS only after the separate deployment and domain work is approved. Rotate the previously shared private token before production.

## Validation

Last verified locally with `npm test -- --run` (124 tests), `npm run typecheck`, `npm run lint`, and `npm run build`. See [`visual-review.md`](visual-review.md) for responsive route checks and measurement limits. Re-run the checks after later source changes.
