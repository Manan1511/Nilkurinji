# Storefront assets

The active merchandise scope is tea and tea bags. Local preview artwork is illustrative only and does not establish Nilkurinji packaging, ingredients, origin, harvest, or product details. Replace concept imagery with approved merchant photography before production.

## Transparent tea cutouts

| File | Dimensions | Alpha | Use |
| --- | ---: | --- | --- |
| `public/images/category-icon-tea.png` | 1254 × 1254 | Yes | Loose-tea and cup cutout used in the homepage format choice and tea collection preview |
| `public/images/category-icon-tea-bags.png` | 1254 × 1254 | Yes | Tea-bag cutout used in the homepage format choice and tea-bag collection preview |

These assets sit directly on warm parchment with `object-fit: contain`. Do not place circles or masks behind them. The current tea-bag image is a concept asset, not a statement about final bag construction or tea ingredients.

## Homepage hero photograph

`public/images/tea-hero-editorial.webp` is a generated, 1536 × 1024 illustrative tea still life used on the right side of the homepage hero. It shows amber tea and dry leaves without packaging or labels. The distant landscape is visual atmosphere only and does not claim a Nilkurinji estate or product origin. Replace it with approved brand photography before production.

## Botanical brand artwork

`public/images/botanical-tea-spray.webp` is an existing 1222 × 1287 RGBA branch image. The homepage uses it once beside the short brand note, with its transparent edges intact. It is decorative imagery only. It does not identify a tea variety, ingredient, estate, or product origin.

## Product preview imagery

`public/images/preview-product-*.png` and matching `*-wide.webp` files are generated concept pack shots for the non-purchasable catalog preview. They can be replaced by real Shopify product media. Never use them to infer product packaging or claims.

Older home and food-category assets remain in `public/images/` for project history, but the application does not link to non-tea merchandise. Earlier hero and Leaf to Cup scene images are not part of the current homepage composition.

## Production image rules

- Live product cards and galleries use Shopify product media.
- Homepage content uses approved `format_tea_image` and `format_tea_bags_image` references from the `nilkurinji_home` metaobject. The preview cutouts do not fill missing live imagery.
- Keep meaningful image alt text in Shopify. Decorative cutouts must not imply unapproved origins, estates, harvests, ingredients, or specific product forms.
- Preserve intrinsic dimensions and transparency. Do not crop transparent subjects into circles.

For the responsive composition and final review evidence, see [`docs/design/tea-only-reference/asset-manifest.md`](design/tea-only-reference/asset-manifest.md) and [`docs/design/tea-only-reference/handover.md`](design/tea-only-reference/handover.md).
