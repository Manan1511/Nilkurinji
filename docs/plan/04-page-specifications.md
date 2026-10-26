# 04. Page specifications

## Shared shell

All pages use the approved header/footer, one main landmark and one H1, server-rendered first content, honest empty/error states and no live-to-demo fallback. Header is 124px on desktop and 72px on mobile. Search, menu, filter and cart share a single overlay owner.

## Home

Order: header, shallow photographic banner, five category medallions, five-product carousel, four-column trust bar, A3 footer. Hero copy and image refs come from homepage/banner metaobjects; categories and trust items from referenced entries; product cards/prices from Shopify. Category URLs filter Shop. Carousel does not autoplay. If content is unavailable, preserve only approved shell and retry state, never preview imagery in live mode.

## Shop

Order: category banner, six tabs, count/sort/chips, filters and product grid, pagination or Load more, optional approved promo, footer. URL is source of truth. Preserve unrelated tracking params. Filters: Tea Type, Flavour, Caffeine, Price and Availability where applicable. Product cards show image, title, format/pack, correct price, New/sold-out and Add to cart or Choose options. Empty category, zero-match, API failure and image-missing states retain useful recovery.

## Product

Breadcrumb, gallery/purchase split, ingredients/allergen/nutrition/storage details, tea-specific preparation, FAQs, approved genuine reviews, recommendations. Shopify product/variant data is authoritative; optional approved metaobjects enrich it. Variant query selects exactly that variant; price/image/stock update on selection. Never silently replace unavailable selection. Food products do not display tea preparation. Desktop gallery/purchase about 55/45; mobile gallery first with sticky selected-pack action after purchase block leaves view.

## Cart and search

Cart drawer and `/cart` share server-confirmed state, line items, quantities, totals and checkout errors. Buy Now uses a separate cart. Search opens an overlay without shifting the page; min two characters, 300ms debounce, cancel stale calls, six suggestions, Enter to full results. The wishlist UI, API and saved-product state are removed; `/wishlist` permanently redirects to `/shop` for old bookmarks.

## Account

Use Shopify Customer Account OAuth/PKCE, not custom passwords. Provide overview, customer-owned order list/detail and address add/edit/delete/default. Expired sessions refresh safely; inaccessible order IDs reveal no data. Account reads are private and uncached.

## Editorial and business pages

Tea Guide follows A3. Recipes and Journal reuse listing/article templates and use separate Shopify blogs. Article body is sanitised, 65ch, with related products only when explicitly linked. Our Story follows A4 but uses verified copy only. Contact contains verified channels. Shipping/returns and policy content comes from Shopify; no invented timelines or food-return exclusions. Checkout status distinguishes pending from confirmed and confirms only after server/provider verification.
