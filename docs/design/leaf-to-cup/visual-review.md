# Leaf to Cup visual review

Review date: 2026-10-20. Environment: local Next.js production build, preview mode, Chromium in the Codex in-app browser. The storefront ran at `http://127.0.0.1:3000`.

## Responsive review

Checked viewport widths: 320, 390, 768, 1024, 1366, and 1920 CSS pixels. Heights were 740, 844, 900, 900, 768, and 1080 pixels respectively. At every width, `document.documentElement.scrollWidth` equalled `clientWidth`; the homepage had no horizontal overflow. At 1366 × 768, the hero heading, both calls to action, chapter controls, and image all fit within the viewport.

The 320-pixel view keeps the menu, wordmark, Search, and Cart controls on a single row. Hero copy and both calls to action fit without clipping. At 390 pixels, the two format panels stack as distinct photographs with readable labels and links. Cards and body copy retain their natural wrapping.

## Pages and states

Desktop route pass at 1440 × 900: home, shop, Tea, Tea Bags, Rice, Snacks, Other Foods, preview product, search results, cart, wishlist, About, Contact, Privacy Policy, and account fallback. All routes returned a main heading. No loaded image reported a decode failure. Desktop and mobile route samples at 390 × 844 included home, shop, Tea, preview product, search, cart, About, and Contact; none overflowed horizontally.

Visual inspection covered the short-desktop hero, mobile hero, desktop and mobile tea-format panels, and the preview product page. Leaf, Water, and Cup chapter changes keep the headline geometry stable while changing the image and caption. Product images remain distinct from the hero preparation scenes. Sample prices and disabled purchasing are visible on preview product surfaces.

Interaction checks covered chapter selection, search opening and suggestions, search result navigation, mobile navigation, cart drawer, and the mobile filter panel. Search opens over the page rather than moving the content. Search results render at `/search?q=tea`. The cart drawer identifies the preview as non-purchasable. The mobile filters expose categories and an Apply action.

The browser's retained console history contained one React #441 entry timestamped `2026-10-20T14:13:05Z`, from the earlier development session before the SearchForm client boundary fix. After rebuilding and retesting the current production preview, no newer error entry appeared; search results rendered with ten sample-price labels.

## Measurement limits

These are local lab observations, not field-performance measurements. LCP, CLS, and INP were not measured under a recorded network/device profile. Production font delivery, real Shopify media, approved botanical artwork, and real merchant content were not available for this review. Repeat visual and performance checks after approved assets and content are entered in Shopify.
