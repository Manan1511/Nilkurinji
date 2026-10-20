# Redesign asset inventory

This inventory covers the reference assets used by the new page composition and the representative source files whose dimensions and transparency were inspected. It does not certify image licensing, product accuracy, or rendered cropping.

| Asset | Measured source | Used for | Status |
| --- | --- | --- | --- |
| `/public/images/preview-hero-home-v4.png` | 2172 × 724 PNG, opaque | Preview homepage hero and preview social image | Concept image. Source composition has broad negative space at left; code crops toward the right to keep the tea scene visible. Replace with approved campaign photography before production. |
| `/public/images/category-tea.png` | 1122 × 1402 PNG, opaque | Preview Tea discovery panel | Illustrative category image; not a final product photo. |
| `/public/images/category-tea-bags.png` | 1122 × 1402 PNG, opaque | Preview Tea Bags discovery panel | Illustrative category image; not a final product photo. |
| `/public/images/preview-about-leaves.png` | 1536 × 1024 PNG, opaque | About page preview image | Concept imagery. Rendered composition has not been reviewed; it is not used as a global frame decoration. |
| `/public/images/preview-product-assam-gold.png` | 1448 × 1086 PNG, opaque | Preview product detail source | Generated/sample package appearance. Product identity, ingredients, and packaging must be replaced or approved by the owner. |
| `/public/images/preview-product-*-wide.webp` | Not remeasured in this pass | Preview product cards | Existing derivatives. Their contents and dimensions have not been audited in this pass. |
| Shopify product image URLs | Merchant supplied | Live product cards and detail pages | Live images must come from approved Shopify product records; no preview fixture is a live fallback. |

`Opaque` means the inspected file has no useful alpha channel. The transparent category cutouts from the previous composition are no longer used as circular category tiles. This does not imply that every old category asset in `public/images` has been deleted. Legacy imagery was retained to avoid removing unrelated page content or assets by filename alone.

## Replacement checklist

1. Approve real tea and tea-bag pack shots, product names, variants, prices, and stock in Shopify.
2. Replace the hero with approved campaign photography or an approved image from the merchant catalog.
3. Confirm alt text describes the actual image and product.
4. Review crops and image sharpness at mobile and desktop widths after the owner opens the fresh local preview.
5. Remove obsolete images only after a source-reference audit shows they have no remaining consumers.
