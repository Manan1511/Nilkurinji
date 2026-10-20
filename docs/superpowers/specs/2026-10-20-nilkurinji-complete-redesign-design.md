# Nilkurinji complete storefront redesign

Status: proposed design and delivery roadmap, ready for owner review. Planning only; this document does not authorize implementation or deployment.

Planning review: a fresh, read-only builder check found no important unanswered questions. Visual concept selection and owner approval remain the next design checkpoints.

## Intent

Make Nilkurinji feel like a contemporary premium tea brand. The owner has rejected the present visual direction, including the oversized masthead, search that expands the document, and dated overall composition. The new work replaces the presentation across the entire storefront.

Confirmed by the owner: keep the existing logo and green identity; redesign the layouts and typography. The earlier PDFs remain useful for business scope and assets, but their composition no longer governs the redesign. Product photography will be replaced later and should not absorb this phase's effort.

The recommendation is a precise, product-focused tea shop: compact navigation, confident type, clear merchandising, deliberate image crops and useful interactions. Space should separate meaningful content rather than enlarge the header. The following visual and interaction choices are recommendations by the designer, not additional decisions already approved by the owner.

## What the current screenshots establish

- The masthead, branding and navigation occupy roughly a quarter to a third of the visible page before the hero begins.
- Search adds another large section and pushes the hero down. Its large heading, field border, input focus outline and submit button compete for attention.
- Repeated cream surfaces, conventional serif navigation and the decorative landscape composition flatten the hierarchy.
- Previous passes optimized individual details without establishing a convincing whole-page composition.

The redesign must be judged through complete rendered pages and interaction states. Passing compilation or a mechanical detector is not evidence that the visual direction succeeds.

## Design language

### Identity and typography

- Keep the approved logo artwork, its proportions and its green identity. Scale the logo as one unit; do not stretch or redraw it. A proposed compact header lockup must be shown in the concept review if it alters the existing arrangement.
- Keep the current forest green, #254434, as the anchor. Use near-white and soft neutral surfaces, dark ink, and a small tonal green range. Remove ornamental gold treatments and repeated decorative leaves.
- Proposed type pairing: Newsreader for editorial headings and Manrope for body, navigation and controls. The logo's own lettering remains unchanged. Confirm the pairing in the visual concept before production use.
- Body text: 16px minimum, line-height around 1.6. Functional labels: 14px minimum. Search fields and mobile native selects: 16px minimum. Smaller logo lettering or factual metadata must remain subordinate and demonstrably legible.
- Headline targets: 48–68px on desktop and 36–44px on mobile, adjusted for the approved copy. Limit the main headline to two desktop lines and three mobile lines without clipping at 200% zoom.
- Use normal-case labels, consistent type roles, one small-radius control system and clear keyboard focus. Avoid widely tracked micro-labels, ornamental badges and decorative pseudo-content.

### Layout and imagery

- Use a consistent maximum content width of 1440px, with 48px desktop gutters and 20px mobile gutters; allow smaller 16px gutters at 320px if needed.
- Build the hero around one strong image or product study with a clear headline and one primary shopping action. Retire the current faded landscape-and-copy composition.
- Use existing preview imagery during composition work. Keep image frames reusable so approved product photography can replace it without rebuilding layouts.
- No new packaging designs, elaborate asset production, unverified provenance, health claims, shipping promises, fake ratings or invented reviews.
- Motion provides feedback: short hover, disclosure and image transitions. No scroll hijacking, pinned storytelling, looping decorative movement or dependency added solely for simple effects. Reduced motion remains fully supported.

## Header and search

### Compact shared header

- One desktop row, 76px high, containing the compact existing logo at left, navigation in the middle and utilities at right. No second navigation row.
- Mobile/tablet header: 64px high. Collapse the navigation when the complete desktop row cannot fit; never squeeze labels or stack a second header row.
- Primary navigation recommendation: Shop, Tea, Our story, Contact. The logo supplies the Home link. Removing the redundant Home label is part of this proposal; all existing routes remain intact.
- Search, cart, account and wishlist retain their functions. Mobile may move account and wishlist into the menu, while search and cart stay immediately accessible.
- Keep utility hit areas at least 44 by 44px. The logo size, header height and icon alignment are identical across routes.
- The preview notice becomes a restrained single line: "Preview storefront · Purchases disabled". Maximum 24px high on desktop and 36px on mobile. The header plus notice must occupy no more than 100px of the page in their normal state.

### Search overlay

- Search opens over the page; it must not increase header height, change the hero's position or create a new content section.
- Desktop: a compact, non-modal popover anchored below the header's search control, up to 560px wide, constrained to the viewport. Its input is the primary element. Avoid a separate oversized heading and nested input borders.
- Mobile: a viewport-constrained search sheet with a visible close action and an input that remains usable when the keyboard is open. If it blocks the page, use modal dialog semantics, focus containment, inert background and restored scroll position. Desktop non-modal behavior must not trap focus.
- Both variants focus the input on open, close with Escape or the close control, restore focus appropriately, and close when navigating. Desktop outside interaction dismisses the popover without stealing the clicked element's focus.
- Empty input shows a few collection routes, labeled as collection browsing rather than fabricated popular searches.
- Predictive search: wait 300ms after typing, require at least two trimmed characters, cap the query at 120 characters, cancel obsolete requests and display at most six product results. No polling or requests for empty input.
- Each result shows actual product image, title and Shopify-authoritative price where available. Include an explicit link to all results. Enter still submits /search?q=... and direct result URLs remain usable.
- Use a server-only /api/search route backed by the existing typed catalog integration; return only public product fields. Reuse the existing 60-second public cache policy where applicable. No private credential reaches the browser.
- Loading, no matches and API failure are distinct. Preserve the query. A live failure must never insert preview products or prices.

## Page-by-page redesign

| Surface | Result |
| --- | --- |
| Home | Compact shared header; one purposeful hero; a real tea product selection; Tea and Tea Bags discovery; a short brand/story section using approved facts; secondary pantry navigation; concise footer. No repeated decorative strips or invented benefits. |
| Shop and every collection | One consistent catalog system, visible category choices, restrained filtering and sorting, and standardized image frames. Four product columns at wide desktop, three at intermediate widths when cards remain readable, and two on mobile. Filters open in a drawer on small screens. |
| Product cards | Open layouts without heavy enclosing boxes. Stable image ratios, readable names and prices, aligned information, unobtrusive wishlist action. Single-variant live products can expose Add; multi-variant products expose Choose options. Preview products have no inactive purchase controls. |
| Product detail | Large gallery, clearly grouped title and price, readable variants and quantity, obvious Add to cart and secondary Buy Now, then approved details/FAQs/reviews and related products. Desktop purchase details may be sticky within their section; mobile has one uninterrupted purchase flow. |
| Cart | Clean line items and quantity controls, clear stock/error feedback, and a distinct order summary. Desktop summary may be sticky. Mobile checkout must stay discoverable without covering line items. Retain the full /cart route. |
| Full search results | Same typography and product cards as Shop, visible query, useful count and empty-state recovery, and consistent gutters. |
| Wishlist | Same product-card system, browser-saved state, understandable remove action, and a useful empty state. |
| About | A deliberate editorial composition using approved brand facts and existing imagery. Remove the scrapbook/handwritten styling. |
| Contact and account | Clear contact links and the existing Shopify-hosted customer-account handoff. No new contact form or custom account system. |
| Privacy, Refund, Terms | Quiet reading layouts with a 65–75-character measure, readable headings, and unchanged policy meaning. |
| Footer | Compact, useful link groups, existing logo, approved social links and legible legal text. Avoid a disproportionately tall decorative ending. |

Tea Guide, Recipes, Journal and newsletter remain excluded. Rice, Snacks and Other Foods remain available as secondary categories. Review/FAQ content is shown only when backed by the approved source. The homepage is the first visual checkpoint, not the only redesigned route.

## Technical boundaries

- Keep Next.js, React, TypeScript, Tailwind, Netlify and Shopify hosted checkout. Read the installed Next.js 16.4 documentation before implementation.
- Preserve Shopify catalog/cart authority, secure cart cookies, Buy Now cart isolation, authoritative pricing/availability and existing recovery behavior.
- Keep the existing page slugs, server integration and SEO contracts. Recheck metadata, canonical URLs, structured data, robots, sitemap and social previews after layout changes.
- Preserve English, INR and India-only launch defaults. Payment/COD approval and end-to-end merchant-store validation are separate launch work.
- Keep preview products visibly separate from live data; preview checkout and indexing remain disabled. Shared credentials stay in ignored/runtime environment values.
- Replace the presentation through component CSS Modules and a small shared token/base layer. Reuse useful state and commerce logic; retire legacy page styling as each route migrates. Do not append another chain of global specificity overrides.
- Existing useful modules include src/lib/shopify, src/components/product-purchase-panel.tsx, cart-panel.tsx, wishlist state and search query handling. Reuse behavior, not the rejected presentation.
- Update DESIGN.md and .impeccable/design.json from the approved and finished new system, rather than altering documentation to silence detector warnings.
- Local milestone commits may be made after focused verification. Do not push, deploy, change DNS, alter Shopify catalog configuration or enable payments as part of visual implementation without the applicable authorization.

## Delivery roadmap

1. **Visual direction and proof.** Produce materially different first-viewport concepts within the fixed logo/green identity, recommend one, and settle the composition with the owner. Show real layout and copy, not just moodboards. Complete desktop and mobile homepage comps plus search-open states for the chosen direction before production UI work.
2. **Shared foundation and shell.** Establish the approved type/color/spacing/control tokens. Implement the compact header, responsive menu, preview notice, search overlay, public predictive-search endpoint and compact footer. This milestone is rejected if opening search shifts the page.
3. **Homepage.** Build the complete approved composition using existing temporary assets. Review desktop and mobile together. Resolve hierarchy, image framing, copy measure and CTA placement before spreading the system further.
4. **Shopping flow.** Apply the system to Shop, all collections, product cards, product detail, cart, search results and wishlist. Keep existing commerce tests and add interaction tests for new search and responsive controls.
5. **Supporting pages.** Apply the same shell/type/spacing system to About, Contact, account handoff and policy pages. Preserve approved factual and legal content.
6. **Whole-site review and handover.** Inspect rendered pages and states, batch material corrections, rerun relevant tests and production build, document the shipped system, and provide the local preview for final review. Deployment remains a separate step.

Native implementation is the previously chosen execution method. A detailed file/task implementation plan follows approval of this design brief and selection of the visual direction. This roadmap is not permission to skip the visual checkpoints.

## Acceptance checks

- At 1366x768 and 1440x900, the desktop header plus preview notice is at most 100px high; navigation stays on one row.
- At 320, 375, 390, 768, 1024, 1366, 1440 and 1920 CSS-pixel widths, there is no unintended horizontal overflow, logo clipping, elliptical round controls or overlapping utilities.
- Opening desktop search leaves the hero's top coordinate unchanged within 1 CSS pixel. Search content scrolls within its own maximum height where needed.
- At 375x812, 390x844 and the desktop viewports above, the hero heading, short supporting sentence and primary CTA are visible in the initial viewport. At 320x568, permit natural scrolling instead of shrinking type or clipping content.
- At 200% zoom, the layout may reflow to the compact header; content and controls remain available.
- Text contrast meets WCAG AA; visible keyboard focus and at least 44px interactive targets are retained. Price/name alignment survives two-line names, long prices and sold-out variants.
- Search tests cover Escape, focus return, outside dismissal, route changes, one-character/empty input, long queries, cancellation/out-of-order responses, no matches, network failures and live/preview separation.
- Commerce tests cover variants, quantity, unavailable stock, expired carts, API failures and Buy Now isolation. Visual redesign does not itself count as payment or launch validation.
- Run tests, lint, typecheck and the production build; confirm the local app serves the new assets. Performance targets are LCP <=2.5s, CLS <=0.1 and INP <=200ms, assessed honestly in representative lab runs and, after launch, field data where available.
- Review rendered desktop/mobile images before claiming visual completion. Respect the existing restriction on CUA/Playwright/CDP; obtain owner-provided rendered screenshots unless that restriction is explicitly changed. Never replace this visual checkpoint with source-only reassurance.
- The owner sees the complete homepage and search states before implementation moves to the full page rollout. Material review findings are resolved or explicitly reported as open.

## Research references

- [Kettl](https://kettl.co/): product-first merchandising with named teas, visible prices, collection routes and purchase actions. Interpret its clarity for Nilkurinji; do not copy its Japanese product story, classes or subscriptions.
- [Leaves and Flowers](https://leavesandflowers.com/): a focused Shop/Info hierarchy with separate utility actions and useful category routes. Learn from its navigation model without adding excluded editorial/newsletter scope.
- [Baymard search research](https://baymard.com/blog/search-bar-ui): search recognition, input design and useful recovery paths. The overlay design and height targets above are this proposal's choices, not measurements claimed from these references.
- [Newsreader](https://fonts.google.com/specimen/Newsreader) and [Manrope](https://fonts.google.com/specimen/Manrope): proposed fonts to test in the visual direction round.

## Owner review

Already settled: retain the logo and green identity, undertake a complete visual redesign, prioritize the homepage, keep Shopify/Netlify, and avoid spending this phase on final product photography.

Proposed for review: the contemporary editorial direction, compact one-row header, overlay/predictive search, type pairing, homepage sequence and removal of the redundant Home navigation label. Approving this brief sets the constraints for the visual concept round; approving a chosen visual concept sets the appearance for implementation.
