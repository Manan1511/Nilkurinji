# Nilkurinji tea storefront

## Product

Nilkurinji is a Shopify-backed tea brand storefront for two product formats: loose tea and tea bags. The supplied HTML is a visual reference for premium tea presentation. Its unsupported claims, product categories, and product stories are not part of Nilkurinji's content.

## Shopper experience

The site includes Home, one Shop page, Product, Search, Cart, About, Contact, Shopify policies, and the Shopify customer-account handoff. Loose tea and tea bags are filters within Shop, not separate pages. Previous `/collections/tea` and `/collections/tea-bags` links forward to the matching Shop filter. The wishlist feature has been removed.

Catalog, search, direct product, and recommendation data are limited to products assigned to the `tea` or `tea-bags` Shopify collection. The Shop page lets shoppers filter between these two formats. Rice, snacks, other foods, teaware, brewing equipment, storage containers, accessory bundles, and all other merchandise are excluded from the storefront.

Product pages support galleries, Shopify variants, quantity, Add to Cart, Buy Now, approved product information, genuine approved reviews, FAQs, and tea-only recommendations. Preview products cannot be purchased. Live checkout remains hosted by Shopify and uses Shopify prices and availability.

There is no currency chooser. The buyer-facing market defaults to India and INR. Live prices and currency data come from Shopify. Preview prices are explicitly labelled sample prices and remain illustrative.

## Visual direction

The implementation adapts the user's premium tea HTML reference with warm paper, deep forest green, restrained brass, Playfair Display headings, and DM Sans shopping copy. The Nilkurinji wordmark and sprout remain unchanged, with its descriptor omitted. The header stays compact and consistent. Search opens in a modal without adding height or moving the page.

## Brand personality and voice

Nilkurinji is warm, unhurried, and lightly playful. It makes space for different tea habits without making tea feel like a test of expertise. Use clear, everyday language with a little sensory detail. Keep the tone welcoming, never grand or precious. “No perfect cup required” is the homepage brand note. Do not add origin, ingredient, health, quality, or product claims without merchant approval.

The homepage format section shows alpha-transparent cutouts for loose tea and tea bags on warm parchment. Keep their transparency intact and do not add circles or masks behind them. The cutouts are illustrative and do not establish final packaging, ingredients, origin, harvest, or product attributes.

## Preview and launch safety

The local site is a non-indexable design preview. Product names, sample INR amounts, and product imagery are examples only. Preview purchase controls and checkout are disabled. A live Shopify error never falls back to preview products, copy, or prices.

Shopify remains authoritative for products, variants, options, inventory, live prices, carts, hosted checkout, orders, policies, and payments. Merchant approval, the final tea catalog, COD/payment configuration, domain, and production deployment remain separate launch work. See [DESIGN.md](DESIGN.md), [Shopify setup](docs/SHOPIFY_SETUP.md), and the [design handover](docs/design/tea-only-reference/handover.md).
