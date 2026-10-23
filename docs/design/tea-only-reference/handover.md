# Tea-only design handover

Updated 2026-10-20.

## Current design

This tea-only direction replaces the older Leaf to Cup blueprint. It adapts the user's supplied premium storefront reference while retaining Nilkurinji's wordmark, sprout, forest identity, and Shopify-backed commerce model.

Nilkurinji's voice is warm, unhurried, and lightly playful. It helps shoppers choose without making tea feel like a test of expertise. The homepage line “No perfect cup required” carries that personality into the store.

Only tea and tea bags are merchandise. There is no currency selector. Shopify remains authoritative for live products, variant selection, price, inventory, cart totals, and checkout. Preview mode remains non-indexable and non-purchasable, with explicitly illustrative assets and sample INR prices.

## Maintainer references

- Design system and page rules: [`DESIGN.md`](../../../DESIGN.md)
- Product and safety scope: [`PRODUCT.md`](../../../PRODUCT.md)
- Shopify catalog setup: [`docs/SHOPIFY_SETUP.md`](../../SHOPIFY_SETUP.md)
- Asset provenance and handling: [`docs/ASSETS.md`](../../ASSETS.md)
- Asset manifest: [`asset-manifest.md`](asset-manifest.md)
- Visual review record: [`visual-review.md`](visual-review.md)

## Launch boundary

This redesign does not configure merchant payment methods, COD rules, the approved product catalog, DNS, or production deployment. Replace concept images and sample copy with approved merchant content before launch. Confirm production Shopify configuration and payment flows separately.

## Verification record

Latest checks on 2026-10-20: `npm test -- --run` passed (42 files, 126 tests); `npm run typecheck` and `npm run lint` passed; `npm run build` completed successfully with Next.js 16.4.0. The fresh optimized preview is running at `http://127.0.0.1:3000/` in preview mode.

The hero, compact format section, and new brand note were rendered at 460 × 660. Earlier checks at 1366 × 768 and 320 × 800 covered the hero and compact format section. Shop, product, cart, and search states were checked; the preview search endpoint returned six tea suggestions. The full screenshot matrix from the original redesign brief is not claimed complete; see [`visual-review.md`](visual-review.md).
