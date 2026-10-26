# Nilkurinji storefront implementation plan

This plan governs the rebuild of the live-order storefront. The approved desktop screenshots have priority over the previous rejected redesign. Use the final homepage (PDF B, page 2) as the authority when references conflict.

## Reference register

| Ref | PDF page | Implementation use |
|---|---|---|
| A1 | Website plan, p.1 | Tea Bags banner and filters |
| A2 | Website plan, p.2 | Unified Shop layout |
| A3 | Website plan, p.3 | Tea Guide, article cards and footer |
| A4 | Website plan, p.4 | Our Story collage and values |
| B1 | Homepage design, p.1 | Superseded; do not use |
| B2 | Homepage design, p.2 | Homepage authority including Pan India Delivery |

The reference PDFs are [Website plan](../../NILKURINJI%20Website%20plan%202.pdf) and [Homepage design](../../NILKURINJI%20HOME%20PAGE%20DESIGN.pdf). Their embedded screenshots are 1536 × 1024 pixels.

## Decisions

- Next.js App Router, TypeScript, Tailwind v4, Vercel and Shopify Storefront/Customer Account APIs.
- India-only INR storefront, with Tea, Tea Bags, Rice, Snacks and Other Foods in one `/shop` route.
- Main navigation: Home, direct Shop link, Tea Guide, Recipes, Journal and Contact. Utilities: search, account and cart. Wishlist is removed; its old URL redirects to Shop.
- Shopify is authoritative for products, prices, variants, stock, customers and orders. Shopify Admin is the client’s content/admin interface.
- Payment opens an approved provider interface on the storefront. Razorpay Magic Checkout for headless Shopify is the initial technical baseline; Cashfree is an alternative only after equivalent Shopify order completion is verified. Provider remains unselected. Shopify hosted checkout is a recovery path only before capture or after verified unpaid status.
- Desktop fidelity is the first visual gate. The client must approve responsive compositions before the full mobile implementation.
- Preview catalog is illustrative, non-purchasable and never a live fallback.
- No currency switcher, custom database, newsletter, invented claims or fabricated reviews at launch.

## Files

This directory separates design analysis, design tokens, routes, page behaviour, responsive rules, Shopify architecture/data, India commerce, assets, project structure, phases, QA and risks. See `11-build-phases.md` for the current delivery sequence and approval gates.

## Completion gate

Every launch route must match the approved visual language, work with real Shopify data, complete the verified payment-to-Shopify order path, and pass responsive, keyboard, accessibility, commerce and production checks. A build or payment popup alone is not completion.
