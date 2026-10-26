# Storefront asset inventory

## Production rules

- Client product photographs replace concept packaging before real sales.
- Shopify media is authoritative for live product cards and galleries.
- Generated scenes are illustrative and cannot establish product identity, origin, ingredients, harvest, estate or packaging.
- Never generate or bake text, labels, logos, prices or UI into photographs.
- Keep original masters outside public build output; record derivatives, crop and focal point.
- Preserve transparency in PNG/WebP cutouts. Do not tint product photography.
- Missing live content never activates local preview assets.
- Informative images require meaningful alt text; decorative foliage uses empty alt text.

## Current public assets

| Asset group | Files/pattern | Purpose and limitation |
|---|---|---|
| Homepage/collection banners | `public/images/preview-hero-{home,tea,tea-bags}-kurinji.webp` | Panoramic final-homepage and tea-category preview art with the blue-violet brand flower. Illustrative and preview-only. |
| Category lifestyle photos | public/images/category-tea.png, category-tea-bags.png, category-rice.png, category-snacks.png, category-other-foods.png | Preview lifestyle images for editorial/product contexts. Homepage category circles use a clear CSS sage ground instead, so these busy photos do not obscure the medallion. Not product/label evidence. |
| Concept product images | `public/images/preview-product-*-kurinji.png` and `*-wide-kurinji.webp` for tea previews; other `preview-product-*` assets for pantry and ingredient scenes | Non-purchasable preview catalog only; replace with Shopify product media. Tea scene decoration uses blue-violet Nilkurinji blossoms. Jasmine and hibiscus ingredient scenes retain their own flowers. |
| Transparent category subjects | `public/images/category-icon-{tea,tea-bags}-kurinji.webp`, plus `category-icon-{rice,snacks,other-foods}.png` | Preview-only transparent foregrounds layered over the pale CSS sage circle. Tea-bag shape remains illustrative until the real format is approved. |
| Section-specific botanical edges | `public/images/botanical/botanical-{header-left,header-right,home-hero-left,home-hero-right}-refined.webp` plus `botanical-{categories,editorial}-right-kurinji.webp`; PNG masters in `design/masters/kurinji-flowers/` | Header and homepage hero each use their own distinct flowering left/right compositions, cropped to the outer edges. Categories and editorial sections retain separate branch compositions; their visible Nilkurinji blossoms use blue-violet. Decorative only; never tile, mirror into a matched pair, or treat generated leaves as botanical evidence. |
| Historical compositions | public/images/leaf-to-cup and older preview-hero variants | Retained history/source assets. Not the approved homepage direction. |
| Texture and line art | public/images/paper-grain.svg, botanical-benefits-line.svg | Decorative surfaces only; keep subtle and accessible. |

The refined header and hero leaves were generated as separate cutouts using the approved screenshot as an art-direction reference. Each side has its own silhouette and blossoms; transparent PNG masters are preserved outside `public`, with alpha-preserving WebP derivatives for the storefront. Category and editorial edge branches retain their own compositions, with the Nilkurinji bloom color corrected. These assets are decorative and illustrative, not botanically verified. The broader asset inventory is in docs/plan/09-asset-inventory.md.

## Nilkurinji flower color correction

The Nilkurinji flower motif uses a blue-violet to pale mauve range. Kew describes *Strobilanthes kunthiana* corollas as pale blue to mauve, and Kerala Tourism describes the flowers as blue-purple. Do not depict this brand flower as white jasmine/camellia-like blossoms. Jasmine and hibiscus ingredient imagery keeps its own species colors. The generated assets remain illustrative and are not botanical proof.

| Use | Public derivative | Source master |
|---|---|---|
| Header left/right edges | `public/images/botanical/botanical-header-{left,right}-refined.webp` | `design/masters/kurinji-flowers/header-{left,right}.png` |
| Homepage hero left/right edges | `public/images/botanical/botanical-home-hero-{left,right}-refined.webp` | `design/masters/kurinji-flowers/home-hero-{left,right}.png` |
| Category and editorial right-edge branches | `public/images/botanical/botanical-{categories,editorial}-right-kurinji.webp` | `design/masters/kurinji-flowers/botanical-{categories,editorial}-right.png` |
| Tea and Tea Bags category cutouts | `public/images/category-icon-{tea,tea-bags}-kurinji.webp` | `design/masters/kurinji-flowers/category-{tea,tea-bags}-cutout.png` |
| Homepage, Tea and Tea Bags banners | `public/images/preview-hero-{home,tea,tea-bags}-kurinji.webp` | `design/masters/kurinji-flowers/{home,tea,tea-bags}-banner.png` |
| Tea Bags lifestyle photograph | `public/images/category-tea-bags-kurinji.webp` | `design/masters/kurinji-flowers/tea-bags-lifestyle.png` |
| Generic tea preview product scenes | `public/images/preview-product-*-kurinji.png` and `*-wide-kurinji.webp` | `design/masters/kurinji-flowers/product-preview/` |

References: [Kew Plants of the World Online](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A55761-1/general-information), [Kerala Tourism](https://www.keralatourism.org/destination/neelakurinji-the-blue-beauty-in-munnar/377//).

The corrected product-scene derivatives are used only by the non-purchasable preview catalog. Jasmine and hibiscus preview products intentionally keep white jasmine and red hibiscus flowers because those images depict named ingredients, not the Nilkurinji brand flower. These generated packs remain illustrative and must not be mistaken for approved product packaging.

## Required client product photography

For every sellable product and materially different pack:

- Front pack image with the complete product visible.
- Back/label image at readable resolution.
- Additional detail images only when they show actual contents/format.
- Product-specific alt text.
- Variant-specific media when the pack differs.

Do not reuse a 100g pack image as evidence of a 250g pack. Keep colours accurate.

## Mockup-led lifestyle artwork

Create shallow desktop banners for homepage, Shop All, Tea, Tea Bags, Rice, Snacks, Other Foods, Tea Guide, Recipes, Journal, Our Story and the story close. Copy-safe pale space belongs on the left; the lifestyle focal point belongs on the right. Create separate mobile crops where a 4:3 crop would cut the subject. A square medallion is never a banner.

Editorial scenes use warm paper and forest tones with natural light. Do not imply a real Nilkurinji estate or include invented packs. Handwritten phrases remain HTML text.

The Tea Bags photograph must match the client’s real bag format once approved. A generic pyramid bag must not be presented as the actual product without confirmation.

## Logo, fonts and icons

| Asset | Source/use |
|---|---|
| Sprout and wordmark | Recreated from the approved reference after client proof; consistent lockups. |
| Libre Baskerville | next/font editorial headings and display titles. |
| Lato | next/font navigation, commerce, body text and forms. |
| Caveat | next/font for short decorative script. |
| Playfair Display | next/font support for wordmark recreation. |
| Space Mono | next/font for indices and approved numeric data. |
| Lucide React | Interface icons for search, account, cart, filters, arrows and status. |
| Official social marks | Verified marks only; show links only when approved URLs exist. |

## Placeholder strategy

A missing live product image reserves its frame and uses a neutral labelled fallback. Never show a broken-image glyph, generated pack or another product’s image. A missing banner retains readable copy and the shallow composition. Production approval requires the planned compositions and real product photography.

See the [approved plan](plan/README.md), [asset manifest](plan/09-asset-inventory.md) and [current design system](../DESIGN.md).
