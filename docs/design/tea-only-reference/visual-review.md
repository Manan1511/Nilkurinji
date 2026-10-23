# Tea-only visual review

Updated 2026-10-20.

## Direction

The user supplied a premium tea storefront HTML reference. The redesign follows its dark forest image stage, warm-paper canvas, product-first composition, restrained brass details, and high-contrast editorial typography. Nilkurinji's existing wordmark and sprout remain in the compact shared header.

The storefront voice is warm, unhurried, and lightly playful. The homepage says “No perfect cup required” and describes everyday tea moments without inventing product facts or asking shoppers to master tea terminology.

The reference's unsupported origin, estate, harvest, quality, ingredient, shipping, and review claims are not storefront copy. Its teaware, storage, and non-tea merchandise are excluded.

## Page hierarchy

1. Compact shared notice and header.
2. Homepage hero with copy on the left and a tea still-life photograph on the right.
3. Up to three tea products, surfaced before supporting format links.
4. Compact loose-tea and tea-bag format choices with transparent cutouts on parchment.
5. A concise brand note with one contained use of the existing transparent leaf artwork.
6. Brewing information only when an approved Shopify tea profile is available.
7. Shared, compact footer with tea-only navigation.

Search, Shop format filters, direct product lookup, and recommendations must all use the tea-only catalog boundary.

## Rendered review

The rebuilt homepage was reviewed at **1366 × 768** on desktop, **768 × 1024** on tablet, **460 × 660** in the in-app browser, and **320 × 800** on narrow mobile. The hero keeps both collection actions visible at the 1366 × 768 target and wraps the title and buttons cleanly at 320px without horizontal overflow. The product selection now comes before the format feature. Its transparent cutouts remain side by side on mobile and the desktop image frames are capped at 320px, down from the earlier near-square 595px panels. Redundant uppercase labels and decorative panel numbers were removed. The test suite confirms the hero uses its own tea photograph and that the cutouts appear only in the format links.

After the brand-note change, the refreshed build was checked again at **460 × 660**. The new copy gives the homepage a clear, approachable voice, and the existing transparent leaf artwork appears once beside it. The branch keeps its full shape on parchment without a circle, repeated page-edge framing, or a claim about tea ingredients or origin. This latest mobile capture does not establish a new desktop review.

The **320px** search overlay was also reviewed with a typed tea query. It returns six sample suggestions with explicit sample-price labels and a link to all results. The mobile menu was checked at 320px and 460px: both enter from the left beside their left-side trigger, remain within the viewport, and keep the close control visible. Mobile filters also enter from the left, while the cart enters from the right beside its right-side trigger. Search stays under the header without shifting the page. The cart, search, menu, and filter overlays are mutually exclusive. Shop format filters, sorting, product details, and the disabled preview-cart state were checked in the rendered app.

The whole-site interaction pass added shared button press feedback, arrow-only movement, navigation underlines, editorial-image hover/focus response, search-result entrances, gallery-image changes, and FAQ disclosure chevrons. The cart list uses a short entrance when items appear. Reduced motion removes spatial travel, image zoom, and list entrances while preserving state feedback. Product pages, About, Contact, Shop, and the shared header were inspected at desktop or mobile sizes.

The account fallback was also reviewed on mobile and provides a clear next action. The privacy-policy route currently says the policy is being prepared, and account sign-in is unavailable. These are visible setup/content gaps that must be resolved from Shopify/business-approved material before launch; no legal or account copy was fabricated during the design pass. Old wishlist links now forward shoppers to Shop.

The full responsive screenshot matrix at widths **390, 1024, 1440, and 1920px** remains outstanding. The 1366 × 768, 768 × 1024, 460 × 660, and 320 × 800 checks are rendered evidence, not a physical-device test. Full desktop captures of every route also remain outstanding.

No currency selector is present. Shopify still supplies live prices and currency; preview amounts remain labelled sample prices in INR.
