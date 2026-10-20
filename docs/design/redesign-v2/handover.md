# Nilkurinji redesign handover

## What is implemented

The source redesign now covers Home, Shop, all configured collections, search/results, product detail, Cart, Wishlist, About, Contact, Shopify policy pages, and account handoff. It uses a consistent compact shell, editorial/sans-serif type roles, shared product cards, responsive listing grids, and a desktop search popover plus mobile search sheet.

The shopping boundary remains Shopify-owned. Cart requests remain uncached and server authoritative; product Add/Buy Now, card quick-add, and cart controls use a shared mutation queue within the current browser document. The queue does not serialize separate tabs or provide server-wide locking. Buy Now still creates a separate checkout path. Preview catalog products use sample data, display the preview notice, and expose no purchase controls. Preview indexing remains disabled. There is no custom card processing or client-side price conversion.

The source review also fixed wishlist lookup completeness, responsive search focus, and optional Shopify homepage content handling. See the [review matrix](review-matrix.md) for details.

## Evidence

- Branch: `codex/storefront-redesign`.
- Baseline commit: `fee3ed2`.
- Implementation commits already present: `0f83474` (shared foundations and typed predictive search), `a22c7d3` (storefront and shopping interactions).
- The initial baseline was 23 files and 74 tests. The final source suite reported 39 files and 113 tests passing.
- `npm run lint` completed successfully.
- `npm run typecheck` completed successfully.
- A fresh `npm run build` completed successfully on Next.js 16.4 and listed the expected app routes, including cart, search, wishlist, Shop, collections, product detail, About, Contact, and policy pages.
- No secrets were staged as part of this redesign.

## Start the current production build locally

The existing port-3000 process was not stopped, and attempts to launch this build on an alternate port were blocked by automatic execution policy. The new build therefore was not served or inspected in a browser during this turn.

After ensuring no other process owns port 3001, open PowerShell in the project and run:

```powershell
$env:SHOPIFY_MODE = "preview"
$env:SHOPIFY_CHECKOUT_ENABLED = "false"
$env:SHOPIFY_INDEXING_ENABLED = "false"
npm start -- --hostname 127.0.0.1 --port 3001
```

Then open `http://127.0.0.1:3001/`. Use this separate port so the older local process can remain untouched. This starts the built app, not a live Shopify checkout.

## Browser review still required

Open the fresh server and review the rendered result at desktop and mobile sizes. Prioritize the exact concerns that led to the redesign: compact header height, logo/nav spacing, search-open height and keyboard focus, font readability, product-card alignment, mobile filter behavior, repeated illustration usage, and footer proportion. Check keyboard navigation, Escape, outside close, screen-reader labels, virtual keyboard resize, and reduced motion. Replace the stale screenshot references only after fresh captures exist.

Suggested visual widths: 320, 390, 768, 1023, 1024, 1280, and 1440px. Save fresh captures in `.impeccable/review/` only after they show the current server build. Record material findings in `review-matrix.md`, fix them in a batch, and repeat review on affected states.

## Shopify and launch gates

No live storefront catalog, payment, order, inventory, refund, Netlify deployment, DNS, or SSL operation was performed by this redesign implementation. The previous token sharing remains a production hygiene issue. Rotate the private token before production and keep it in the server runtime only.

Before launch, the owner still needs to approve up to 20 merchant products and image assets; product details, FAQ/review content and SEO fields; shipping/COD/refund rules; business and contact facts; social URLs; Shopify merchant-store and headless-channel eligibility; online payment gateway approval; domain access; and Netlify production environment values. After those exist, test browse → cart → hosted checkout, successful/failed/cancelled test payments, Shopify orders and inventory, COD status, and owner-assisted refund handling.

## Workspace and continuation

The checkout contained unrelated dirty changes and untracked files before the implementation branch began. They were preserved. Stage only redesign-owned changes from this branch, keep the separate review-fix and documentation commits, and do not stage unrelated package files, previews, PDFs, screenshots, generated artifacts, or tests simply because they are present in the working tree. Do not push or deploy without explicit authorization.
