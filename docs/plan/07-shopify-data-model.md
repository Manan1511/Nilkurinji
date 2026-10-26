# 07. Shopify data model

## Products and variants

Use one Shopify product per recipe/identity and format. Loose tea and its tea-bag counterpart are linked sibling products, not one invalid format × pack-size matrix. Native product variants represent `Pack size`; prices, inventory, SKU and weight belong to variants. Food products use their own appropriate pack-size values. Publish to Headless channel.

Products carry title, handle, description, product type, vendor, images/alt text and SEO. Variant option name is `Pack size`. Client maintains current price, compare-at price only when legitimate, stock, weight, tax setting, SKU/barcode and publication.

Collections: `shop-all`, `tea`, `tea-bags`, `rice`, `snacks`, `other-foods`, `featured-products`. Curated membership is acceptable for a small launch catalog; validate every product’s expected collection.

## Product metafields (`nilkurinji` namespace)

| Key | Type | Use |
|---|---|---|
| `department`, `format`, `family_key`, `short_description` | single line text | Category and format identity |
| `sibling_products` | list product reference | Other formats |
| `tea_type`, `caffeine`, `shelf_life`, `country_of_origin`, `manufacturer_fssai`, `dietary_declaration` | single line text | Approved product classification/details |
| `flavours`, `tasting_notes`, `allergens` | list single-line text | Approved structured copy |
| `ingredients`, `allergen_statement`, `storage`, `manufacturer_details` | multi-line text | Label information |
| `how_its_made` | multi-line text | Product-specific process copy, displayed only when approved |
| `how_its_made_approved` | boolean | Explicit publication gate for `how_its_made` |
| `nutrition` | JSON | Supplied serving basis and rows |
| `new_until` | date | Badge expiry |
| `brewing` | metaobject reference | Approved tea-only preparation |
| `faqs`, `reviews` | list metaobject reference | Approved content |

Variant metafields: `net_quantity` text, `bag_count` integer, `net_weight_g` decimal, `hsn_code` text. Expose only public-read fields. Never calculate nutrition from ingredients.

## Metaobjects

- `nilkurinji_site/main`: logo lockups, footer line, verified contact/social/legal details.
- `nilkurinji_banner`: eyebrow, heading, body, CTA label/path, desktop/mobile images, alt, focal points, optional script phrase.
- `nilkurinji_home/home`: version, hero, headings/intros, ordered category refs, featured collection, approved trust refs. Keep legacy fields for migration rollback.
- `nilkurinji_category`: key/title/collection/illustration/banner/intro/optional promo.
- `nilkurinji_trust_item`: title/body/icon/approved.
- `nilkurinji_story/main` and `nilkurinji_value`: verified story, collage images, values, closing banner.
- `nilkurinji_blog_landing`: blog handle, banner, intro, ordered topics.
- `nilkurinji_contact/main`, `nilkurinji_shipping/india`, `nilkurinji_faq`, `nilkurinji_review`, `nilkurinji_brewing`.

Shopify blogs: `tea-guide`, `recipes`, `journal`. Articles use native title, handle, image/alt, excerpt/body, author/date/SEO; optional `related_products`, recipe JSON and `content_reviewed` metafields. Store blog handle as text; no blog-reference metafield type. Keep review consent/proof private. No custom admin screen or database for launch.
