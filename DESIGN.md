# Nilkurinji design system

## Authority

Follow the supplied approved mockups: final homepage (PDF B, page 2), unified Shop adapted from the Tea listing, Tea Bags banner treatment, Tea Guide from Our Tips, and Our Story collage. The old homepage and previous Leaf-to-Cup/tea-only compositions are superseded. The reference screenshots are 1536 × 1024px; they are visual guidance, not vector source files.

## Visual language

- Warm paper and muted cream surfaces, forest-green headings and actions, restrained antique-gold detail.
- Centred sprout and stacked Nilkurinji wordmark with its approved descriptor.
- Two-row desktop header, left search, right account/cart utilities, and one consistent navigation.
- Shallow panoramic image banners with copy in the pale left region and merchandise/lifestyle focal point to the right.
- Five category medallions with a clear photo ground and separate transparent subject, landscape product-card imagery, fine separators, forest trust band and restrained botanical framing.
- Use a distinct left/right botanical composition for the header, homepage hero, and category row. Keep the hero copy area and category labels clear; do not reuse one pair down the page or mirror the same sprig.
- When a flower represents Nilkurinji, depict the Neelakurinji (Strobilanthes kunthiana) bloom in blue-violet through pale mauve. Kew records the corolla as pale blue to mauve; do not represent this flower with white jasmine/camellia-like blossoms. Keep ingredient flowers such as jasmine and hibiscus in their own species colors. See [Kew Plants of the World Online](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A55761-1/general-information) and [Kerala Tourism](https://www.keralatourism.org/destination/neelakurinji-the-blue-beauty-in-munnar/377//).
- Tea Guide and Journal cards use editorial landscape photography.
- Our Story uses layered paper and polaroid-style photographs, with text kept as HTML.
- Do not repeat foliage as a full-page wallpaper, stretch square artwork into a banner, bake copy into imagery, or filter real product photography.

## Implemented tokens

Source of truth: src/app/storefront-tokens.css.

| Token | Value |
|---|---|
| paper | #F3EFE3 |
| paper-light | #F6F2E6 |
| card | #F1EEDF |
| parchment / image ground | #ECE0CA |
| forest | #163122 |
| forest hover | #254B35 |
| ink | #142B1C |
| muted / ash | #525346 |
| sage | #DEDFD1 |
| rule | #D3CCBC |
| brass / gold | #AAA07B |
| control border | #6F7768 |
| violet | #6E5D7B |
| error | #9B302A |

Typography loaded through next/font: Libre Baskerville 400/700 for editorial headings, Lato 400/700 for navigation and commerce, Caveat 400 for short decorative script, Playfair Display 400 for the wordmark, and Space Mono 400/700 for occasional numerical labels. The actual CSS tokens use Libre Baskerville, Lato, Caveat, Playfair Display and Space Mono. Do not replace them with the superseded Playfair/DM Sans proposal without design approval.

## Geometry and motion

- Header: 124px desktop, 72px mobile. The separate preview notice is 24px.
- Desktop homepage hero: 264px panoramic banner; the approved screenshot is roughly 251px.
- Main gutters: 16px below 360px, 20px default, 32px from 768px, 48px from 1200px.
- Shop: 224px filter sidebar at wide desktop; four columns at 1280px and above, three at tablet, two from 360px, one below 360px.
- Product imagery follows the compact landscape reference. Reserve the media ratio before loading.
- Main controls are at least 44px high and purchase/checkout controls are at least 48px.
- Use pill-shaped primary actions as in the approved screenshots; product cards have restrained 4px corners.
- Motion: 160ms action feedback, 180ms navigation reveal, 240ms panel transitions, image hover up to 1.02 over 650ms. Decorative branches sway asynchronously over 8–10 seconds with sub-degree rotation and about 1px of drift; reduced motion disables the sway, image zoom and spatial motion.

## Content and interaction rules

The five launch categories are Tea, Tea Bags, Rice, Snacks and Other Foods. One Shop route contains all categories. Pack size, correct variant, price, availability and tax display must remain visible and factual. A multi-variant product uses Choose options. Search and drawers are overlays and never add header height or move page content. Mobile navigation and filters open from the left; cart opens from the right. Only one overlay is active.

The final homepage category medallions use separate circular photo grounds and transparent category cutouts, so foreground objects can extend beyond the circle. Header, hero, category and banner foliage uses the two distinct transparent branch assets in varied scale and orientation, clipped to each section and kept clear of copy and controls. Never tile the branches as a page background or substitute preview category art in live mode.

Preview prices are labelled Sample price and preview concept imagery is disclosed. Live failures never activate preview content. Brass on paper is decorative only. Focus remains visible, essential text meets contrast requirements, all icon-only actions have accessible names, and reduced-motion preferences are respected.

## UI implementation notes

- Keep the shared shell dimensions identical across routes.
- Preserve title wrapping and readable support text; do not shrink text to fit.
- Product packaging stays colour accurate.
- Product pages include a “How it’s made” section only when approved, product-specific plain-text process copy is available; preview pages use a clearly marked pending-details message.
- Generated Kurinji flower art is illustrative; use verified botanical references before describing it as botanically accurate.
- Use alt text from approved Shopify media; decorative leaves use empty alt text.
- No invented quality, origin, health, delivery or ingredient claims.
- Keep responsive differences documented and approved.

This file describes the current implementation; the approved multi-page reference and detailed decisions are in docs/plan/README.md and its linked section files.
